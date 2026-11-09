import { PDFDocument } from "pdf-lib";
import { PDF_WORKER_SRC } from "@/lib/constants";
import { ProcessingError } from "../contracts/errors";
import type { ProcessingResult, ProgressCallback } from "../contracts/types";
import { outputName } from "./compress";
import {
  LEVEL_START_INDEX,
  MAX_CANVAS_PIXELS,
  RENDER_LADDER,
  type CompressLevel,
  type RenderStep,
} from "./compressLevels";

export interface FlattenOptions {
  level: CompressLevel;
  /** Size target in kilobytes, or 0 for none. */
  targetKb: number;
  grayscale: boolean;
}

type PdfJs = typeof import("pdfjs-dist");
let pdfjsPromise: Promise<PdfJs> | null = null;
function loadPdfJs(): Promise<PdfJs> {
  if (!pdfjsPromise) {
    pdfjsPromise = import("pdfjs-dist").then((m) => {
      m.GlobalWorkerOptions.workerSrc = PDF_WORKER_SRC;
      return m;
    });
  }
  return pdfjsPromise;
}

const cancelled = () => new ProcessingError("CANCELLED", "Cancelled.");

function canvasToJpeg(canvas: HTMLCanvasElement, quality: number): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return reject(new ProcessingError("OUT_OF_MEMORY", "The page was too large to process on this device."));
        blob.arrayBuffer().then((b) => resolve(new Uint8Array(b)), reject);
      },
      "image/jpeg",
      quality,
    );
  });
}

function toGrayscale(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  const img = ctx.getImageData(0, 0, width, height);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const y = (d[i] as number) * 0.299 + (d[i + 1] as number) * 0.587 + (d[i + 2] as number) * 0.114;
    d[i] = d[i + 1] = d[i + 2] = y;
  }
  ctx.putImageData(img, 0, 0);
}

/**
 * "Flatten pages" compression: every page is drawn to a picture and the pictures are saved as a new PDF.
 * It runs on the main thread because pdf.js needs a real canvas, but pdf.js parses in its own worker and the loop
 * yields between pages. A size target is met by searching a ladder of resolution and quality settings.
 */
export async function flattenCompress(
  bytes: Uint8Array,
  fileName: string,
  opts: FlattenOptions,
  onProgress?: ProgressCallback,
  signal?: AbortSignal,
): Promise<ProcessingResult> {
  const pdfjs = await loadPdfJs();
  let src;
  try {
    src = await pdfjs.getDocument({ data: bytes.slice(), isEvalSupported: false }).promise;
  } catch (err) {
    if ((err as { name?: string }).name === "PasswordException") {
      throw new ProcessingError("ENCRYPTED_PDF", `"${fileName}" is password-protected or encrypted. Remove the protection first, then try again.`);
    }
    throw new ProcessingError("CORRUPT_PDF", `"${fileName}" could not be read; it may be damaged.`);
  }

  try {
    const pageCount = src.numPages;
    const budgetBytes = opts.targetKb > 0 ? opts.targetKb * 1024 : 0;
    const maxBuilds = budgetBytes ? 4 : 1;
    let buildNo = 0;

    const build = async (step: RenderStep): Promise<Uint8Array> => {
      const out = await PDFDocument.create();
      for (let p = 1; p <= pageCount; p++) {
        if (signal?.aborted) throw cancelled();
        onProgress?.(
          Math.min(0.97, (buildNo + (p - 1) / pageCount) / maxBuilds),
          buildNo > 0 ? `Trying a smaller setting: page ${p} of ${pageCount}` : `Compressing page ${p} of ${pageCount}`,
        );
        const page = await src.getPage(p);
        const base = page.getViewport({ scale: 1 });
        const limit = Math.sqrt(MAX_CANVAS_PIXELS / (base.width * base.height));
        const viewport = page.getViewport({ scale: Math.max(0.2, Math.min(step.scale, limit)) });
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.floor(viewport.width));
        canvas.height = Math.max(1, Math.floor(viewport.height));
        const ctx = canvas.getContext("2d", { willReadFrequently: opts.grayscale });
        if (!ctx) throw new ProcessingError("OUT_OF_MEMORY", "This browser could not create a drawing surface.");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvasContext: ctx, viewport, background: "#ffffff" }).promise;
        if (opts.grayscale) toGrayscale(ctx, canvas.width, canvas.height);
        const jpeg = await canvasToJpeg(canvas, step.quality);
        canvas.width = 0; // release the pixel buffer right away; this matters on phones
        canvas.height = 0;
        page.cleanup();
        const image = await out.embedJpg(jpeg);
        const outPage = out.addPage([base.width, base.height]);
        outPage.drawImage(image, { x: 0, y: 0, width: base.width, height: base.height });
        await new Promise((r) => setTimeout(r, 0)); // let the browser paint and stay responsive
      }
      buildNo++;
      return out.save({ useObjectStreams: true });
    };

    let result: Uint8Array;
    let note = "Pages were converted to images, so text can no longer be selected or searched, and links and form fields are gone.";
    if (!budgetBytes) {
      result = await build(RENDER_LADDER[LEVEL_START_INDEX[opts.level]] as RenderStep);
    } else {
      let lo = 0;
      let hi = RENDER_LADDER.length - 1;
      let best: Uint8Array | null = null;
      let smallest: Uint8Array | null = null;
      while (lo <= hi && buildNo < maxBuilds) {
        const mid = Math.floor((lo + hi) / 2);
        const out = await build(RENDER_LADDER[mid] as RenderStep);
        if (!smallest || out.length < smallest.length) smallest = out;
        if (out.length <= budgetBytes) {
          best = out;
          hi = mid - 1;
        } else {
          lo = mid + 1;
        }
      }
      if (best) result = best;
      else {
        result = smallest as Uint8Array;
        note = `The smallest setting still gave ${Math.round(result.length / 1024)} KB, above your ${opts.targetKb >= 1024 ? "1 MB" : `${opts.targetKb} KB`} target. ` + note;
      }
    }

    onProgress?.(1, "Done");
    if (result.length >= bytes.length) {
      return {
        blob: new Blob([bytes as BlobPart], { type: "application/pdf" }),
        filename: fileName,
        mimeType: "application/pdf",
        pageCount,
        originalBytes: bytes.length,
        unchanged: true,
        note: "Flattening did not make this file smaller, so the download is your original, unchanged.",
      };
    }
    return {
      blob: new Blob([result as BlobPart], { type: "application/pdf" }),
      filename: outputName(fileName),
      mimeType: "application/pdf",
      pageCount,
      originalBytes: bytes.length,
      note,
    };
  } finally {
    void src.destroy();
  }
}
