import { LIMITS } from "@/config/limits";
import { formatBytes } from "@/lib/formatBytes";
import { IMAGE_LEVELS, TARGETS_KB } from "@/processing/operations/compressLevels";
import type { CompressLevelOption, CompressModeOption } from "./types";

export const compressConfig = {
  tool: "compress-pdf" as const,
  inputAccept: "application/pdf,.pdf",
  uploadLabel: "Choose a PDF or drop it here",
  uploadHint: `One PDF at a time, up to ${formatBytes(LIMITS.compress.maxFileBytes)}. Flatten mode handles up to ${LIMITS.compress.maxFlattenPages} pages.`,
  modes: [
    {
      value: "keep-text",
      label: "Keep text selectable",
      help: "Shrinks the JPEG pictures inside the PDF and leaves text, links and drawings alone. Only helps PDFs that contain JPEG images.",
    },
    {
      value: "flatten",
      label: "Flatten pages to images",
      help: "Draws every page as a picture. Works on any PDF and can aim for a size, but text can no longer be selected or searched.",
    },
  ] satisfies CompressModeOption[],
  levels: [
    { value: "balanced", label: "Balanced", help: `Images up to ${IMAGE_LEVELS.balanced.maxSide} px on the long side. Good for most documents.` },
    { value: "smaller", label: "Smaller", help: `Images up to ${IMAGE_LEVELS.smaller.maxSide} px. Small print may look softer.` },
    { value: "smallest", label: "Smallest", help: `Images up to ${IMAGE_LEVELS.smallest.maxSide} px. Clearly lower quality.` },
  ] satisfies CompressLevelOption[],
  targets: TARGETS_KB.map((kb) => ({
    value: kb,
    label: kb === 0 ? "No target (use the level above)" : kb === 1024 ? "Under 1 MB" : `Under ${kb} KB`,
  })),
};
