"use client";
import { useImagesToPdf } from "@/features/image-to-pdf/hooks/useImagesToPdf";
import { jpgToPdfVariant } from "../config";

export function useJpgToPdf() {
  return useImagesToPdf(jpgToPdfVariant);
}
