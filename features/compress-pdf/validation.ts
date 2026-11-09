import { LIMITS } from "@/config/limits";
import type { ValidationRules } from "@/lib/fileValidation";
import type { CompressMode } from "./types";

export const compressRules: ValidationRules = {
  accept: ["pdf"],
  maxFileBytes: LIMITS.compress.maxFileBytes,
  maxFiles: 1,
  maxTotalBytes: LIMITS.compress.maxFileBytes,
};

/** Returns a user-facing problem with the current choice, or null when it is fine. */
export function compressProblem(mode: CompressMode, pages: number | undefined): string | null {
  if (!pages) return null;
  if (pages > LIMITS.compress.maxPages) return `This PDF has ${pages} pages. This tool processes up to ${LIMITS.compress.maxPages} pages.`;
  if (mode === "flatten" && pages > LIMITS.compress.maxFlattenPages) {
    return `Flatten mode draws every page and handles up to ${LIMITS.compress.maxFlattenPages} pages; this PDF has ${pages}. Use "Keep text selectable", or split the PDF first.`;
  }
  return null;
}
