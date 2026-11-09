import { readJpegOrientation } from "@/lib/exif";
import { detectFileType } from "@/lib/magicBytes";
import { ProcessingError } from "../../contracts/errors";
import type { PreparedImage } from "../../operations/imagesToPdf";

/**
 * Turns an uploaded image into something pdf-lib can embed (JPEG or PNG bytes).
 *  - PNG and upright JPEG: embedded byte-for-byte, so no re-encoding happens.
 *  - JPEG with an EXIF rotation, or any image you rotated: redrawn and re-encoded (JPEG quality 0.92, PNG lossless).
 *  - WebP: decoded and stored as PNG (lossless copy of the decoded pixels).
 */
export async function prepareImage(file: File, rotation: 0 | 90 | 180 | 270 = 0): Promise<PreparedImage> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const kind = detectFileType(bytes.subarray(0, 1100));
  if (kind === "png") return rotation === 0 ? { kind: "png", bytes } : redraw(bytes, "image/png", rotation);
  if (kind === "jpeg") {
    if (rotation === 0 && readJpegOrientation(bytes) <= 1) return { kind: "jpeg", bytes };
    return redraw(bytes, "image/jpeg", rotation);
  }
  if (kind === "webp") return redraw(bytes, "image/png", rotation);
  throw new ProcessingError("UNSUPPORTED_TYPE", "That file is not a JPG, PNG or WebP image.");
}

async function redraw(bytes: Uint8Array, outType: "image/jpeg" | "image/png", rotation: number): Promise<PreparedImage> {
  if (typeof createImageBitmap === "undefined" || typeof OffscreenCanvas === "undefined") {
    throw new ProcessingError(
      "UNSUPPORTED_TYPE",
      "This browser cannot decode WebP or rotated photos here. Please update your browser, or use JPG or PNG files.",
    );
  }
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(new Blob([bytes as BlobPart]), { imageOrientation: "from-image" });
  } catch {
    throw new ProcessingError("CORRUPT_IMAGE", "One of the images could not be read.");
  }
  try {
    const quarter = rotation === 90 || rotation === 270;
    const canvas = new OffscreenCanvas(quarter ? bitmap.height : bitmap.width, quarter ? bitmap.width : bitmap.height);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new ProcessingError("OUT_OF_MEMORY", "Not enough memory to decode an image.");
    if (outType === "image/jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.drawImage(bitmap, -bitmap.width / 2, -bitmap.height / 2);
    const blob = await canvas.convertToBlob({ type: outType, quality: 0.92 });
    return { kind: outType === "image/png" ? "png" : "jpeg", bytes: new Uint8Array(await blob.arrayBuffer()) };
  } finally {
    bitmap.close();
  }
}
