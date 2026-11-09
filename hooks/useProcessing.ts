"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { setToolStatus } from "@/lib/toolStatus";
import { trackEvent, type EventParams } from "@/lib/analytics";
import { ProcessingError, serializeError } from "@/processing/contracts/errors";
import type { ProcessingResult } from "@/processing/contracts/types";
import { getRouter } from "@/processing/router/processingRouter";

export type RunStatus = "idle" | "processing" | "done" | "error";

export function useProcessing(tool: NonNullable<EventParams["tool"]>) {
  const [status, setStatus] = useState<RunStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [label, setLabel] = useState("");
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      setToolStatus("idle");
    };
  }, []);

  const run = useCallback(
    async (payload: unknown, fileCount: number) => {
      const controller = new AbortController();
      abortRef.current = controller;
      setStatus("processing");
      setToolStatus("processing");
      setProgress(0);
      setLabel("Starting");
      setResult(null);
      setError(null);
      trackEvent("tool_started", { tool, file_count: fileCount });
      try {
        const router = await getRouter();
        const res = await router.run(payload, {
          signal: controller.signal,
          onProgress: (f, l) => {
            setProgress(Math.min(1, Math.max(0, f)));
            if (l) setLabel(l);
          },
        });
        setResult(res);
        setStatus("done");
        setToolStatus("done");
        trackEvent("tool_completed", { tool, file_count: fileCount });
      } catch (err) {
        if (err instanceof ProcessingError && err.code === "CANCELLED") {
          setStatus("idle");
          setToolStatus("ready");
          return;
        }
        const s = serializeError(err);
        setError(s.message);
        setStatus("error");
        setToolStatus("error");
        trackEvent("tool_failed", { tool, error_code: s.code });
      } finally {
        abortRef.current = null;
      }
    },
    [tool],
  );

  const cancel = useCallback(() => abortRef.current?.abort(), []);
  const reset = useCallback(() => {
    setStatus("idle");
    setResult(null);
    setError(null);
    setProgress(0);
    setToolStatus("idle");
  }, []);

  return { status, progress, label, result, error, run, cancel, reset };
}
