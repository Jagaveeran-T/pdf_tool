import { LIMITS } from "@/config/limits";
import { formatBytes } from "@/lib/formatBytes";

export const mergeConfig = {
  tool: "merge-pdf" as const,
  inputAccept: "application/pdf,.pdf",
  outputName: "merged.pdf",
  uploadLabel: "Choose PDF files or drop them here",
  uploadHint: `PDF only. ${LIMITS.merge.minFiles} to ${LIMITS.merge.maxFiles} files, ${formatBytes(LIMITS.merge.maxFileBytes)} each.`,
};
