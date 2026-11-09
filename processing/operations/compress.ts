import { PDFArray, PDFDict, PDFName, PDFRawStream, PDFBool, type PDFRef } from "pdf-lib";
import { ProcessingError } from "../contracts/errors";
import type { ProcessingResult, ProgressCallback } from "../contracts/types";
import { IMAGE_LEVELS, type CompressLevel } from "./compressLevels";
import { loadPdf } from "./merge";

export interface ReencodedJpeg {
  bytes: Uint8Array;
  width: number;
  height: number;
}

/** Turns JPEG bytes into smaller JPEG bytes. Injected so the logic can be tested without a browser. */
export interface JpegCodec {
  reencode(bytes: Uint8Array, maxSide: number, quality: number): Promise<ReencodedJpeg | null>;
}

/** Uses the browser's own decoder and encoder (works in a Web Worker). Returns null when the browser cannot do it. */
export const browserJpegCodec: JpegCodec = {
  async reencode(bytes, maxSide, quality) {
    if (typeof OffscreenCanvas === "undefined" || typeof createImageBitmap === "undefined") return null;
    let bitmap: ImageBitmap;
    try {
      // "none": ignore EXIF orientation, because PDF viewers ignore it too.
      bitmap = await createImageBitmap(new Blob([bytes as BlobPart], { type: "image/jpeg" }), { imageOrientation: "none" });
    } catch {
      return null;
    }
    try {
      const ratio = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
      const width = Math.max(1, Math.round(bitmap.width * ratio));
      const height = Math.max(1, Math.round(bitmap.height * ratio));
      const canvas = new OffscreenCanvas(width, height);
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(bitmap, 0, 0, width, height);
      const blob = await canvas.convertToBlob({ type: "image/jpeg", quality });
      canvas.width = 0;
      canvas.height = 0;
      return { bytes: new Uint8Array(await blob.arrayBuffer()), width, height };
    } finally {
      bitmap.close();
    }
  },
};

const name = (n: string) => PDFName.of(n);

function filterIsPlainJpeg(dict: PDFDict): boolean {
  const filter = dict.lookup(name("Filter"));
  if (filter === name("DCTDecode")) return true;
  if (filter instanceof PDFArray && filter.size() === 1) return filter.lookup(0) === name("DCTDecode");
  return false;
}

/** Only plain RGB or grey JPEGs are touched. CMYK, masks, indexed colour and decode arrays are left exactly as they are. */
function isSafeToRecompress(dict: PDFDict): boolean {
  if (dict.lookup(name("Subtype")) !== name("Image")) return false;
  if (!filterIsPlainJpeg(dict)) return false;
  if (dict.has(name("Mask")) || dict.has(name("SMask")) || dict.has(name("Decode")) || dict.has(name("DecodeParms"))) return false;
  const mask = dict.lookup(name("ImageMask"));
  if (mask instanceof PDFBool && mask.asBoolean()) return false;
  const cs = dict.lookup(name("ColorSpace"));
  if (cs === name("DeviceRGB") || cs === name("DeviceGray")) return true;
  if (cs instanceof PDFArray && cs.lookup(0) === name("ICCBased")) {
    const profile = cs.lookup(1);
    const n = profile instanceof PDFRawStream ? profile.dict.lookup(name("N")) : undefined;
    const comps = n && "asNumber" in n ? (n as { asNumber(): number }).asNumber() : 0;
    return comps === 1 || comps === 3;
  }
  return false;
}

export interface KeepTextStats {
  imagesFound: number;
  imagesShrunk: number;
}

/**
 * "Keep text" compression: finds JPEG images inside the PDF, scales them down and re-saves them at a lower quality.
 * Text, vector drawings, links and everything else stay untouched. If nothing gets smaller, the original file is returned.
 */
export async function compressKeepText(
  bytes: Uint8Array,
  fileName: string,
  level: CompressLevel,
  codec: JpegCodec = browserJpegCodec,
  onProgress?: ProgressCallback,
  signal?: AbortSignal,
): Promise<ProcessingResult & { stats: KeepTextStats }> {
  const doc = await loadPdf(bytes, fileName);
  const { maxSide, quality } = IMAGE_LEVELS[level];
  const candidates: { ref: PDFRef; stream: PDFRawStream }[] = [];
  for (const [ref, obj] of doc.context.enumerateIndirectObjects()) {
    if (obj instanceof PDFRawStream && isSafeToRecompress(obj.dict)) candidates.push({ ref, stream: obj });
  }

  const stats: KeepTextStats = { imagesFound: candidates.length, imagesShrunk: 0 };
  for (let i = 0; i < candidates.length; i++) {
    if (signal?.aborted) throw new ProcessingError("CANCELLED", "Cancelled.");
    onProgress?.(0.05 + (i / Math.max(1, candidates.length)) * 0.85, `Compressing image ${i + 1} of ${candidates.length}`);
    const { ref, stream } = candidates[i] as { ref: PDFRef; stream: PDFRawStream };
    const original = stream.contents;
    const out = await codec.reencode(original, maxSide, quality);
    // Keep the new image only when it is clearly smaller; otherwise the original stays.
    if (!out || out.bytes.length >= original.length * 0.95) continue;
    const dict = doc.context.obj({
      Type: "XObject",
      Subtype: "Image",
      Width: out.width,
      Height: out.height,
      ColorSpace: "DeviceRGB",
      BitsPerComponent: 8,
      Filter: "DCTDecode",
      Length: out.bytes.length,
    });
    doc.context.assign(ref, PDFRawStream.of(dict, out.bytes));
    stats.imagesShrunk++;
  }

  onProgress?.(0.92, "Saving");
  const saved = await doc.save({ useObjectStreams: true });
  const pageCount = doc.getPageCount();

  let note: string | undefined;
  if (stats.imagesFound === 0) {
    note = "This PDF has no JPEG images that this mode can shrink (it may be text, vector graphics, or images stored in another format). Try the flatten mode if it is a scan.";
  } else if (stats.imagesShrunk === 0) {
    note = "The images in this PDF could not be made noticeably smaller at this level. Try a smaller level or the flatten mode.";
  }
  if (saved.length >= bytes.length) {
    return {
      blob: new Blob([bytes as BlobPart], { type: "application/pdf" }),
      filename: fileName,
      mimeType: "application/pdf",
      pageCount,
      originalBytes: bytes.length,
      unchanged: true,
      note: note ?? "The result was not smaller than your file, so the download is your original, unchanged.",
      stats,
    };
  }
  return {
    blob: new Blob([saved as BlobPart], { type: "application/pdf" }),
    filename: outputName(fileName),
    mimeType: "application/pdf",
    pageCount,
    originalBytes: bytes.length,
    note,
    stats,
  };
}

export function outputName(fileName: string): string {
  const base = fileName.replace(/\.pdf$/i, "").replace(/[\\/]/g, "_").slice(0, 100) || "document";
  return `${base}-compressed.pdf`;
}
