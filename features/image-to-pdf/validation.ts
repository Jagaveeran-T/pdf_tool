import { LIMITS } from "@/config/limits";
import { imagesToPdfOptionsSchema } from "@/processing/contracts/payloads";
import type { ValidationRules } from "@/lib/fileValidation";
import type { ImagesToPdfVariant } from "./types";

export function imageRules(variant: ImagesToPdfVariant): ValidationRules {
  return { accept: variant.accept, ...LIMITS.images };
}

export function parseImageOptions(value: unknown) {
  return imagesToPdfOptionsSchema.safeParse(value);
}
