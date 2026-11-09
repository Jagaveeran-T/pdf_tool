import { LIMITS } from "@/config/limits";
import type { ValidationRules } from "@/lib/fileValidation";
import type { MergeUiState } from "./types";

export const mergeRules: ValidationRules = {
  accept: ["pdf"],
  maxFileBytes: LIMITS.merge.maxFileBytes,
  maxFiles: LIMITS.merge.maxFiles,
  maxTotalBytes: LIMITS.merge.maxTotalBytes,
};

export function mergeState(readyCount: number, blocking: boolean): MergeUiState {
  if (blocking) return { canMerge: false, reason: "Remove files marked with a problem before merging." };
  if (readyCount < LIMITS.merge.minFiles) return { canMerge: false, reason: `Add at least ${LIMITS.merge.minFiles} PDF files to merge.` };
  return { canMerge: true };
}
