import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";
import { LIMITS } from "@/config/limits";
import { parsePageRanges, type PageRange } from "@/lib/pageRanges";
import { ProcessingError } from "../contracts/errors";
import type { SplitMode } from "../contracts/payloads";
import type { ProcessingResult, ProgressCallback } from "../contracts/types";
import { loadPdf } from "./merge";

export interface SplitOptions {
  mode: SplitMode;
  ranges?: string;
}

async function buildPdf(src: PDFDocument, indexes: number[]): Promise<Uint8Array> {
  const out = await PDFDocument.create();
  const pages = await out.copyPages(src, indexes);
  pages.forEach((p) => out.addPage(p));
  return out.save();
}

const indexesOf = (r: PageRange) => Array.from({ length: r.end - r.start + 1 }, (_, i) => r.start - 1 + i);

export async function splitPdf(
  bytes: Uint8Array,
  fileName: string,
  options: SplitOptions,
  onProgress?: ProgressCallback,
): Promise<ProcessingResult> {
  const src = await loadPdf(bytes, fileName);
  const total = src.getPageCount();
  if (total > LIMITS.split.maxPages) {
    throw new ProcessingError("TOO_LARGE", `This PDF has ${total} pages. This tool processes up to ${LIMITS.split.maxPages} pages.`);
  }

  if (options.mode === "extract") {
    const ranges = parsePageRanges(options.ranges ?? "", total);
    const indexes = ranges.flatMap(indexesOf);
    const out = await buildPdf(src, indexes);
    return {
      blob: new Blob([out as BlobPart], { type: "application/pdf" }),
      filename: "extracted.pdf",
      mimeType: "application/pdf",
      pageCount: indexes.length,
    };
  }

  const groups: { label: string; indexes: number[] }[] =
    options.mode === "each-page"
      ? Array.from({ length: total }, (_, i) => ({ label: `page-${i + 1}`, indexes: [i] }))
      : parsePageRanges(options.ranges ?? "", total).map((r, i) => ({ label: `range-${i + 1}`, indexes: indexesOf(r) }));

  if (groups.length > LIMITS.split.maxOutputFiles) {
    throw new ProcessingError("INVALID_RANGE", `That would create ${groups.length} files. The limit is ${LIMITS.split.maxOutputFiles}.`);
  }

  const outputs: { name: string; data: Uint8Array; pages: number }[] = [];
  for (let i = 0; i < groups.length; i++) {
    const g = groups[i] as { label: string; indexes: number[] };
    onProgress?.(i / groups.length, `Creating file ${i + 1} of ${groups.length}`);
    outputs.push({ name: `${g.label}.pdf`, data: await buildPdf(src, g.indexes), pages: g.indexes.length });
  }

  if (outputs.length === 1) {
    const only = outputs[0] as (typeof outputs)[number];
    return {
      blob: new Blob([only.data as BlobPart], { type: "application/pdf" }),
      filename: only.name,
      mimeType: "application/pdf",
      pageCount: only.pages,
    };
  }

  onProgress?.(0.95, "Creating ZIP");
  const zip = new JSZip();
  const used = new Set<string>();
  for (const o of outputs) {
    let name = o.name;
    for (let n = 2; used.has(name); n++) name = o.name.replace(/\.pdf$/, `-${n}.pdf`);
    used.add(name);
    zip.file(name, o.data);
  }
  const blob = await zip.generateAsync({ type: "blob", compression: "STORE" });
  return { blob, filename: "split-pages.zip", mimeType: "application/zip", outputCount: outputs.length };
}
