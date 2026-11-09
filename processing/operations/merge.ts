import { PDFDocument, degrees } from "pdf-lib";
import { ProcessingError, serializeError } from "../contracts/errors";
import type { ProcessingResult, ProgressCallback } from "../contracts/types";

export interface PdfInput {
  name: string;
  bytes: Uint8Array;
  /** Extra clockwise rotation applied to every page of this file. */
  rotation?: 0 | 90 | 180 | 270;
}

export async function loadPdf(bytes: Uint8Array, name: string): Promise<PDFDocument> {
  try {
    return await PDFDocument.load(bytes, { updateMetadata: false });
  } catch (err) {
    const s = serializeError(err);
    const code = s.code === "ENCRYPTED_PDF" ? "ENCRYPTED_PDF" : "CORRUPT_PDF";
    const base = code === "ENCRYPTED_PDF" ? "is password-protected or encrypted" : "could not be read; it may be damaged";
    throw new ProcessingError(code, `"${name}" ${base}. Remove it from the list or fix it, then try again.`);
  }
}

export async function mergePdfs(
  inputs: PdfInput[],
  outputName = "merged.pdf",
  onProgress?: ProgressCallback,
): Promise<ProcessingResult> {
  if (inputs.length < 2) throw new ProcessingError("EMPTY", "Add at least two PDF files to merge.");
  const out = await PDFDocument.create();
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i] as PdfInput;
    onProgress?.(i / inputs.length, `Merging file ${i + 1} of ${inputs.length}`);
    const src = await loadPdf(input.bytes, input.name);
    const pages = await out.copyPages(src, src.getPageIndices());
    pages.forEach((p) => {
      if (input.rotation) p.setRotation(degrees((p.getRotation().angle + input.rotation) % 360));
      out.addPage(p);
    });
  }
  onProgress?.(0.95, "Saving");
  const bytes = await out.save();
  return {
    blob: new Blob([bytes as BlobPart], { type: "application/pdf" }),
    filename: outputName,
    mimeType: "application/pdf",
    pageCount: out.getPageCount(),
  };
}
