"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { validateFiles, type ValidationRules } from "@/lib/fileValidation";
import { newId, moveItem } from "@/lib/fileHelpers";
import type { Rotation } from "@/processing/contracts/payloads";
import type { DetectedType } from "@/lib/magicBytes";
import { previewPdf } from "@/lib/pdfThumbnails";

export interface UploadedItem {
  id: string;
  file: File;
  kind: DetectedType;
  /** Object URL for image previews, or a data URL for PDF thumbnails. */
  preview?: string;
  pages?: number;
  /** Clockwise rotation chosen by the user. */
  rotation: Rotation;
  state: "ready" | "checking" | "error";
  error?: string;
}

export function useFileUpload(rules: ValidationRules) {
  const [items, setItems] = useState<UploadedItem[]>([]);
  const [messages, setMessages] = useState<string[]>([]);
  const itemsRef = useRef<UploadedItem[]>([]);
  const urlsRef = useRef<Set<string>>(new Set());
  const rulesRef = useRef(rules);
  rulesRef.current = rules;

  const commit = useCallback((next: UploadedItem[]) => {
    itemsRef.current = next;
    setItems(next);
  }, []);

  const revoke = (url?: string) => {
    if (url && urlsRef.current.has(url)) {
      URL.revokeObjectURL(url);
      urlsRef.current.delete(url);
    }
  };

  useEffect(() => {
    const urls = urlsRef.current;
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
      urls.clear();
    };
  }, []);

  const addFiles = useCallback(
    async (input: FileList | File[]) => {
      const files = Array.from(input);
      const current = itemsRef.current;
      const { accepted, rejected } = await validateFiles(files, rulesRef.current, {
        count: current.length,
        totalBytes: current.reduce((s, i) => s + i.file.size, 0),
      });
      setMessages(rejected.map((r) => r.message));
      if (accepted.length === 0) return;

      const added: UploadedItem[] = accepted.map(({ file, kind }) => {
        let preview: string | undefined;
        if (kind !== "pdf") {
          preview = URL.createObjectURL(file);
          urlsRef.current.add(preview);
        }
        return { id: newId(), file, kind, preview, rotation: 0 as Rotation, state: kind === "pdf" ? "checking" : "ready" };
      });
      commit([...itemsRef.current, ...added]);

      for (const item of added.filter((a) => a.kind === "pdf")) {
        const info = await previewPdf(item.file).catch(() => ({ pages: 0, thumbnail: null, encrypted: false, corrupt: true }));
        const patch: Partial<UploadedItem> = info.encrypted
          ? { state: "error", error: "Password-protected PDFs cannot be opened by this tool. Remove it from the list." }
          : info.corrupt
            ? { state: "error", error: "This PDF could not be read. It may be damaged. Remove it from the list." }
            : { state: "ready", pages: info.pages, preview: info.thumbnail ?? undefined };
        commit(itemsRef.current.map((i) => (i.id === item.id ? { ...i, ...patch } : i)));
      }
    },
    [commit],
  );

  const remove = useCallback(
    (id: string) => {
      const target = itemsRef.current.find((i) => i.id === id);
      revoke(target?.preview);
      commit(itemsRef.current.filter((i) => i.id !== id));
      setMessages([]);
    },
    [commit],
  );

  const rotate = useCallback(
    (id: string) =>
      commit(
        itemsRef.current.map((i) => (i.id === id ? { ...i, rotation: ((i.rotation + 90) % 360) as Rotation } : i)),
      ),
    [commit],
  );

  const reorder = useCallback(
    (from: number, to: number) => commit(moveItem(itemsRef.current, from, to)),
    [commit],
  );

  const clear = useCallback(() => {
    itemsRef.current.forEach((i) => revoke(i.preview));
    commit([]);
    setMessages([]);
  }, [commit]);

  const totalBytes = items.reduce((s, i) => s + i.file.size, 0);
  const hasBlocking = items.some((i) => i.state !== "ready");
  return { items, messages, addFiles, remove, rotate, reorder, clear, totalBytes, hasBlocking, dismissMessages: () => setMessages([]) };
}
