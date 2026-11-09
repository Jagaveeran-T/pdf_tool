"use client";
import { useCallback } from "react";
import { downloadBlob } from "@/lib/fileHelpers";
import type { ProcessingResult } from "@/processing/contracts/types";

/** Starts a download for a result. The temporary Blob URL is revoked right after the browser has started saving. */
export function useDownload() {
  return useCallback((result: ProcessingResult) => downloadBlob(result.blob, result.filename), []);
}
