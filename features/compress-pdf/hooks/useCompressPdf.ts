"use client";
import { useCallback, useEffect, useState } from "react";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useProcessing } from "@/hooks/useProcessing";
import { setToolStatus } from "@/lib/toolStatus";
import { compressProblem, compressRules } from "../validation";
import type { CompressLevel, CompressMode, TargetKb } from "../types";

export function useCompressPdf() {
  const upload = useFileUpload(compressRules);
  const processing = useProcessing("compress-pdf");
  const [mode, setMode] = useState<CompressMode>("keep-text");
  const [level, setLevel] = useState<CompressLevel>("balanced");
  const [targetKb, setTargetKb] = useState<TargetKb>(0);
  const [grayscale, setGrayscale] = useState(false);
  const { status } = processing;
  const item = upload.items[0];

  useEffect(() => {
    if (status === "idle") setToolStatus(item ? "ready" : "idle");
  }, [status, item]);

  const problem = compressProblem(mode, item?.pages);
  const canCompress = Boolean(item && item.state === "ready" && item.pages && !problem);

  /** Compression works on one file: picking another replaces the current one. */
  const choose = useCallback(
    (files: File[]) => {
      upload.clear();
      void upload.addFiles(files.slice(0, 1));
    },
    [upload],
  );

  const compress = useCallback(() => {
    if (!item || !canCompress) return;
    void processing.run(
      {
        operation: "compress-pdf",
        file: item.file,
        mode,
        level,
        targetKb: mode === "flatten" ? targetKb : 0,
        grayscale: mode === "flatten" && grayscale,
      },
      1,
    );
  }, [item, canCompress, processing, mode, level, targetKb, grayscale]);

  const startOver = useCallback(() => {
    processing.reset();
    upload.clear();
  }, [processing, upload]);

  return { upload, item, processing, mode, setMode, level, setLevel, targetKb, setTargetKb, grayscale, setGrayscale, problem, canCompress, choose, compress, startOver };
}
