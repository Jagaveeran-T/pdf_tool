import { readFileSync } from "node:fs";
import { join } from "node:path";
import JSZip from "jszip";
import { PDFDocument } from "pdf-lib";
import { describe, expect, it } from "vitest";
import { splitPdf } from "@/processing/operations/split";

const fx = (n: string) => new Uint8Array(readFileSync(join(__dirname, "../fixtures", n)));
const three = fx("sample-3pages.pdf");

describe("splitPdf", () => {
  it("extracts listed pages into one PDF, in the typed order", async () => {
    const r = await splitPdf(three, "three.pdf", { mode: "extract", ranges: "3, 1" });
    expect(r.mimeType).toBe("application/pdf");
    expect(r.pageCount).toBe(2);
    const doc = await PDFDocument.load(new Uint8Array(await r.blob.arrayBuffer()));
    expect(doc.getPageCount()).toBe(2);
  });

  it("makes one PDF per page inside a ZIP", async () => {
    const r = await splitPdf(three, "three.pdf", { mode: "each-page" });
    expect(r.mimeType).toBe("application/zip");
    expect(r.outputCount).toBe(3);
    const zip = await JSZip.loadAsync(await r.blob.arrayBuffer());
    expect(Object.keys(zip.files).sort()).toEqual(["page-1.pdf", "page-2.pdf", "page-3.pdf"]);
  });

  it("makes one PDF per range", async () => {
    const r = await splitPdf(three, "three.pdf", { mode: "ranges", ranges: "1-2, 3" });
    const zip = await JSZip.loadAsync(await r.blob.arrayBuffer());
    const files = Object.keys(zip.files).sort();
    expect(files).toEqual(["range-1.pdf", "range-2.pdf"]);
    const first = await PDFDocument.load(await zip.files["range-1.pdf"]!.async("uint8array"));
    expect(first.getPageCount()).toBe(2);
  });

  it("returns a plain PDF when a range split produces a single file", async () => {
    const r = await splitPdf(three, "three.pdf", { mode: "ranges", ranges: "2-3" });
    expect(r.mimeType).toBe("application/pdf");
  });

  it("explains invalid ranges", async () => {
    await expect(splitPdf(three, "three.pdf", { mode: "extract", ranges: "9" })).rejects.toMatchObject({ code: "INVALID_RANGE" });
    await expect(splitPdf(three, "three.pdf", { mode: "extract", ranges: "" })).rejects.toMatchObject({ code: "INVALID_RANGE" });
  });

  it("rejects encrypted and corrupt files with specific errors", async () => {
    await expect(splitPdf(fx("encrypted.pdf"), "locked.pdf", { mode: "each-page" })).rejects.toMatchObject({ code: "ENCRYPTED_PDF" });
    await expect(splitPdf(fx("corrupt.pdf"), "broken.pdf", { mode: "each-page" })).rejects.toMatchObject({ code: "CORRUPT_PDF" });
    await expect(splitPdf(fx("not-a-pdf.pdf"), "text.pdf", { mode: "each-page" })).rejects.toMatchObject({ code: "CORRUPT_PDF" });
  });
});
