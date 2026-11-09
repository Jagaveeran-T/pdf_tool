import type { ImagesToPdfOptions } from "@/processing/contracts/payloads";

export type { ImagesToPdfOptions };

export interface ImagesToPdfVariant {
  tool: "image-to-pdf" | "jpg-to-pdf";
  accept: ("jpeg" | "png" | "webp")[];
  /** value for the <input accept> attribute */
  inputAccept: string;
  defaults: ImagesToPdfOptions;
  outputName: string;
  uploadLabel: string;
  uploadHint: string;
  convertLabel: string;
}
