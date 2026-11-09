"use client";
import { useCallback, useEffect, useState } from "react";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useProcessing } from "@/hooks/useProcessing";
import { setToolStatus } from "@/lib/toolStatus";
import type { ImagesToPdfOptions, ImagesToPdfVariant } from "../types";
import { imageRules, parseImageOptions } from "../validation";

export function useImagesToPdf(variant: ImagesToPdfVariant) {
  const upload = useFileUpload(imageRules(variant));
  const processing = useProcessing(variant.tool);
  const [options, setOptions] = useState<ImagesToPdfOptions>(variant.defaults);
  const { status } = processing;

  useEffect(() => {
    if (status === "idle") setToolStatus(upload.items.length > 0 ? "ready" : "idle");
  }, [status, upload.items.length]);

  const convert = useCallback(() => {
    const parsed = parseImageOptions(options);
    if (!parsed.success || upload.items.length === 0) return;
    void processing.run(
      { operation: "images-to-pdf", files: upload.items.map((i) => i.file), rotations: upload.items.map((i) => i.rotation), options: parsed.data, outputName: variant.outputName },
      upload.items.length,
    );
  }, [options, upload.items, processing, variant.outputName]);

  const startOver = useCallback(() => {
    processing.reset();
    upload.clear();
  }, [processing, upload]);

  return { upload, processing, options, setOptions, convert, startOver };
}
