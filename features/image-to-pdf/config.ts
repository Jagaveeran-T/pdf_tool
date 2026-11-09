import { LIMITS } from "@/config/limits";
import { formatBytes } from "@/lib/formatBytes";
import type { ImagesToPdfVariant } from "./types";

export const imageToPdfVariant: ImagesToPdfVariant = {
  tool: "image-to-pdf",
  accept: ["jpeg", "png", "webp"],
  inputAccept: "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp",
  defaults: { pageSize: "a4", orientation: "auto", margin: "small" },
  outputName: "images.pdf",
  uploadLabel: "Choose images or drop them here",
  uploadHint: `JPG, PNG or WebP. Up to ${LIMITS.images.maxFiles} images, ${formatBytes(LIMITS.images.maxFileBytes)} each.`,
  convertLabel: "Convert to PDF",
};
