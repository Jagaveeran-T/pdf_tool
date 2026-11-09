import { LIMITS } from "@/config/limits";
import { formatBytes } from "@/lib/formatBytes";
import type { JpgToPdfVariant } from "./types";

export const jpgToPdfVariant: JpgToPdfVariant = {
  tool: "jpg-to-pdf",
  accept: ["jpeg"],
  inputAccept: "image/jpeg,.jpg,.jpeg",
  defaults: { pageSize: "fit", orientation: "auto", margin: "none" },
  outputName: "photos.pdf",
  uploadLabel: "Choose JPG photos or drop them here",
  uploadHint: `JPG or JPEG only. Up to ${LIMITS.images.maxFiles} photos, ${formatBytes(LIMITS.images.maxFileBytes)} each.`,
  convertLabel: "Convert to PDF",
};
