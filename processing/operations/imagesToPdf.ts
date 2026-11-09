import { PDFDocument } from "pdf-lib";
import { ProcessingError } from "../contracts/errors";
import type { ImagesToPdfOptions } from "../contracts/payloads";
import type { ProcessingResult, ProgressCallback } from "../contracts/types";

export interface PreparedImage {
  kind: "jpeg" | "png";
  bytes: Uint8Array;
}

/** Page sizes in PDF points (1 pt = 1/72 inch). */
export const PAGE_SIZES = {
  a4: { width: 595.28, height: 841.89 },
  letter: { width: 612, height: 792 },
} as const;

export const MARGINS = { none: 0, small: 18, medium: 36 } as const;

/** Images are treated as 96 pixels per inch (1 px = 0.75 pt). A 1200 x 1600 px photo is 900 x 1200 pt in "fit to image" mode. */
export const PX_TO_PT = 0.75;

export async function imagesToPdf(
  images: PreparedImage[],
  options: ImagesToPdfOptions,
  outputName = "images.pdf",
  onProgress?: ProgressCallback,
): Promise<ProcessingResult> {
  if (images.length === 0) throw new ProcessingError("EMPTY", "Add at least one image first.");
  const doc = await PDFDocument.create();
  const margin = MARGINS[options.margin];

  for (let i = 0; i < images.length; i++) {
    const img = images[i] as PreparedImage;
    let embedded;
    try {
      embedded = img.kind === "jpeg" ? await doc.embedJpg(img.bytes) : await doc.embedPng(img.bytes);
    } catch {
      throw new ProcessingError("CORRUPT_IMAGE", `Image ${i + 1} could not be read. It may be damaged.`);
    }
    const iw = embedded.width * PX_TO_PT;
    const ih = embedded.height * PX_TO_PT;

    let pageW: number;
    let pageH: number;
    if (options.pageSize === "fit") {
      pageW = iw + margin * 2;
      pageH = ih + margin * 2;
    } else {
      const base = PAGE_SIZES[options.pageSize];
      const landscape = options.orientation === "landscape" || (options.orientation === "auto" && iw > ih);
      pageW = landscape ? base.height : base.width;
      pageH = landscape ? base.width : base.height;
    }

    const boxW = pageW - margin * 2;
    const boxH = pageH - margin * 2;
    // Scale down to fit inside the margins; small images are never enlarged.
    const scale = Math.min(1, boxW / iw, boxH / ih);
    const drawW = iw * scale;
    const drawH = ih * scale;
    const page = doc.addPage([pageW, pageH]);
    page.drawImage(embedded, { x: (pageW - drawW) / 2, y: (pageH - drawH) / 2, width: drawW, height: drawH });
    onProgress?.((i + 1) / images.length, `Added image ${i + 1} of ${images.length}`);
  }

  const out = await doc.save();
  return {
    blob: new Blob([out as BlobPart], { type: "application/pdf" }),
    filename: outputName,
    mimeType: "application/pdf",
    pageCount: images.length,
  };
}
