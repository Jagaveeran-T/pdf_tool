"use client";
import { useCallback, useEffect } from "react";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useProcessing } from "@/hooks/useProcessing";
import { setToolStatus } from "@/lib/toolStatus";
import { mergeConfig } from "../config";
import { mergeRules, mergeState } from "../validation";

export function useMergePdf() {
  const upload = useFileUpload(mergeRules);
  const processing = useProcessing("merge-pdf");
  const { status } = processing;

  useEffect(() => {
    if (status === "idle") setToolStatus(upload.items.length > 0 ? "ready" : "idle");
  }, [status, upload.items.length]);

  const ui = mergeState(upload.items.filter((i) => i.state === "ready").length, upload.hasBlocking);

  const merge = useCallback(() => {
    if (!ui.canMerge) return;
    void processing.run(
      {
        operation: "merge-pdf",
        files: upload.items.map((i) => i.file),
        rotations: upload.items.map((i) => i.rotation),
        outputName: mergeConfig.outputName,
      },
      upload.items.length,
    );
  }, [ui.canMerge, upload.items, processing]);

  const startOver = useCallback(() => {
    processing.reset();
    upload.clear();
  }, [processing, upload]);

  return { upload, processing, ui, merge, startOver };
}
