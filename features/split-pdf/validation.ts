import { LIMITS } from "@/config/limits";
import type { ValidationRules } from "@/lib/fileValidation";
import { parsePageRanges } from "@/lib/pageRanges";
import { ProcessingError } from "@/processing/contracts/errors";
import type { SplitMode } from "./types";

export const splitRules: ValidationRules = {
  accept: ["pdf"],
  maxFileBytes: LIMITS.split.maxFileBytes,
  maxFiles: 1,
  maxTotalBytes: LIMITS.split.maxFileBytes,
};

/** Returns a user-facing problem with the current input, or null when it is fine. */
export function splitProblem(mode: SplitMode, ranges: string, pages: number | undefined): string | null {
  if (!pages) return null;
  if (pages > LIMITS.split.maxPages) return `This PDF has ${pages} pages. This tool processes up to ${LIMITS.split.maxPages} pages.`;
  if (mode === "each-page") return null;
  if (!ranges.trim()) return "Enter the pages you want, for example 1-3, 5.";
  try {
    parsePageRanges(ranges, pages);
    return null;
  } catch (e) {
    return e instanceof ProcessingError ? e.message : "That page range is not valid.";
  }
}
