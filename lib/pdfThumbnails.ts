import { PDF_WORKER_SRC, THUMBNAIL_WIDTH } from "./constants";

export interface PdfPreview {
  pages: number;
  thumbnail: string | null;
  encrypted: boolean;
  corrupt: boolean;
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

/** Page count plus a small first-page thumbnail. pdf.js is loaded lazily, only when a PDF is added. */
export async function previewPdf(file: File): Promise<PdfPreview> {
  const pdfjs = await loadPdfJs();
  const data = new Uint8Array(await file.arrayBuffer());
  let doc;
  try {
    doc = await pdfjs.getDocument({ data, isEvalSupported: false }).promise;
  } catch (err) {
    const name = (err as { name?: string }).name;
    if (name === "PasswordException") return { pages: 0, thumbnail: null, encrypted: true, corrupt: false };
    return { pages: 0, thumbnail: null, encrypted: false, corrupt: true };
  }
  try {
    const pages = doc.numPages;
    let thumbnail: string | null = null;
    try {
      const page = await doc.getPage(1);
      const base = page.getViewport({ scale: 1 });
      const viewport = page.getViewport({ scale: (THUMBNAIL_WIDTH * 2) / base.width });
      const canvas = document.createElement("canvas");
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      const ctx = canvas.getContext("2d");
      if (ctx) {
        await page.render({ canvasContext: ctx, viewport }).promise;
        thumbnail = canvas.toDataURL("image/jpeg", 0.7);
      }
    } catch {
      thumbnail = null; // a missing thumbnail must never block the tool
    }
    return { pages, thumbnail, encrypted: false, corrupt: false };
  } finally {
    void doc.destroy();
  }
}
