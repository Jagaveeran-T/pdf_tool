import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PDFDocument } from "pdf-lib";
import { describe, expect, it } from "vitest";
import { imagesToPdf, PAGE_SIZES, PX_TO_PT, type PreparedImage } from "@/processing/operations/imagesToPdf";

const fx = (n: string) => new Uint8Array(readFileSync(join(__dirname, "../fixtures", n)));
const jpg: PreparedImage = { kind: "jpeg", bytes: fx("sample.jpg") }; // 1200 x 800 px
const png: PreparedImage = { kind: "png", bytes: fx("sample.png") }; // 800 x 1000 px

async function open(result: { blob: Blob }) {
  return PDFDocument.load(new Uint8Array(await result.blob.arrayBuffer()));
}

describe("imagesToPdf", () => {
  it("creates one page per image, in order", async () => {
    const r = await imagesToPdf([jpg, png, jpg], { pageSize: "a4", orientation: "auto", margin: "small" });
    const doc = await open(r);
    expect(doc.getPageCount()).toBe(3);
    expect(r.pageCount).toBe(3);
    expect(r.mimeType).toBe("application/pdf");
  });

  it("uses A4 and switches to landscape for a wide image when orientation is auto", async () => {
    const doc = await open(await imagesToPdf([jpg, png], { pageSize: "a4", orientation: "auto", margin: "none" }));
    const [wide, tall] = [doc.getPage(0).getSize(), doc.getPage(1).getSize()];
    expect(wide.width).toBeCloseTo(PAGE_SIZES.a4.height, 1);
    expect(wide.height).toBeCloseTo(PAGE_SIZES.a4.width, 1);
    expect(tall.width).toBeCloseTo(PAGE_SIZES.a4.width, 1);
  });

  it("forces portrait or landscape when asked", async () => {
    const doc = await open(await imagesToPdf([jpg], { pageSize: "letter", orientation: "portrait", margin: "none" }));
    expect(doc.getPage(0).getSize()).toEqual({ width: PAGE_SIZES.letter.width, height: PAGE_SIZES.letter.height });
  });

  it("makes the page match the image in fit mode, plus the margin on every side", async () => {
    const doc = await open(await imagesToPdf([jpg], { pageSize: "fit", orientation: "auto", margin: "medium" }));
    const { width, height } = doc.getPage(0).getSize();
    expect(width).toBeCloseTo(1200 * PX_TO_PT + 72, 1);
    expect(height).toBeCloseTo(800 * PX_TO_PT + 72, 1);
  });

  it("embeds an upright JPEG without re-encoding it", async () => {
    const r = await imagesToPdf([jpg], { pageSize: "fit", orientation: "auto", margin: "none" });
    const bytes = new Uint8Array(await r.blob.arrayBuffer());
    // The original JPEG bytes appear verbatim inside the PDF stream.
    const needle = jpg.bytes.subarray(0, 64);
    const hay = Buffer.from(bytes);
    expect(hay.indexOf(Buffer.from(needle))).toBeGreaterThan(-1);
  });

  it("reports progress", async () => {
    const seen: number[] = [];
    await imagesToPdf([jpg, png], { pageSize: "a4", orientation: "auto", margin: "none" }, "x.pdf", (p) => seen.push(p));
    expect(seen.at(-1)).toBe(1);
  });

  it("refuses an empty list and damaged images with readable errors", async () => {
    await expect(imagesToPdf([], { pageSize: "a4", orientation: "auto", margin: "none" })).rejects.toMatchObject({ code: "EMPTY" });
    await expect(
      imagesToPdf([{ kind: "jpeg", bytes: new Uint8Array([1, 2, 3, 4]) }], { pageSize: "a4", orientation: "auto", margin: "none" }),
    ).rejects.toMatchObject({ code: "CORRUPT_IMAGE" });
  });
});
