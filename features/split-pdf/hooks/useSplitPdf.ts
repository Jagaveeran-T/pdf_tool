"use client";
import { useCallback, useEffect, useState } from "react";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useProcessing } from "@/hooks/useProcessing";
import { setToolStatus } from "@/lib/toolStatus";
import { splitProblem, splitRules } from "../validation";
import type { SplitMode } from "../types";

export function useSplitPdf() {
  const upload = useFileUpload(splitRules);
  const processing = useProcessing("split-pdf");
  const [mode, setMode] = useState<SplitMode>("extract");
  const [ranges, setRanges] = useState("");
  const { status } = processing;
  const item = upload.items[0];

  useEffect(() => {
    if (status === "idle") setToolStatus(item ? "ready" : "idle");
  }, [status, item]);

  const problem = splitProblem(mode, ranges, item?.pages);
  const canSplit = Boolean(item && item.state === "ready" && item.pages && !problem);

  /** Splitting works on one file: picking another replaces the current one. */
  const choose = useCallback(
    (files: File[]) => {
      upload.clear();
      setRanges("");
      void upload.addFiles(files.slice(0, 1));
    },
    [upload],
  );

  const split = useCallback(() => {
    if (!item || !canSplit) return;
    void processing.run({ operation: "split-pdf", file: item.file, mode, ranges: mode === "each-page" ? undefined : ranges }, 1);
  }, [item, canSplit, processing, mode, ranges]);

  const startOver = useCallback(() => {
    processing.reset();
    upload.clear();
    setRanges("");
  }, [processing, upload]);

  return { upload, item, processing, mode, setMode, ranges, setRanges, problem, canSplit, choose, split, startOver };
}
