import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PDFDocument, PDFName, PDFRawStream } from "pdf-lib";
import { describe, expect, it } from "vitest";
import { compressKeepText, outputName, type JpegCodec } from "@/processing/operations/compress";
import { IMAGE_LEVELS, LEVEL_START_INDEX, RENDER_LADDER } from "@/processing/operations/compressLevels";

const fx = (n: string) => new Uint8Array(readFileSync(join(__dirname, "../fixtures", n)));

/** A PDF with one real JPEG image on its page. */
async function pdfWithJpeg(): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const image = await doc.embedJpg(fx("sample.jpg"));
  const page = doc.addPage([400, 300]);
  page.drawImage(image, { x: 0, y: 0, width: 400, height: 300 });
  return doc.save();
}

/** Pretends to shrink every image to 10% of its size and 100 x 50 pixels. */
const shrinkingCodec = (calls: { maxSide: number; quality: number }[] = []): JpegCodec => ({
  async reencode(bytes, maxSide, quality) {
    calls.push({ maxSide, quality });
    return { bytes: new Uint8Array(Math.max(10, Math.floor(bytes.length / 10))), width: 100, height: 50 };
  },
});
const uselessCodec: JpegCodec = { reencode: async (bytes) => ({ bytes: new Uint8Array(bytes.length), width: 10, height: 10 }) };
const unavailableCodec: JpegCodec = { reencode: async () => null };

describe("compressKeepText", () => {
  it("replaces JPEG images with smaller ones and keeps the page", async () => {
    const calls: { maxSide: number; quality: number }[] = [];
    const src = await pdfWithJpeg();
    const r = await compressKeepText(src, "scan.pdf", "smaller", shrinkingCodec(calls));
    expect(r.stats).toEqual({ imagesFound: 1, imagesShrunk: 1 });
    expect(r.unchanged).toBeUndefined();
    expect(r.filename).toBe("scan-compressed.pdf");
    expect(r.originalBytes).toBe(src.length);
    expect(r.blob.size).toBeLessThan(src.length);
    expect(calls).toEqual([{ maxSide: IMAGE_LEVELS.smaller.maxSide, quality: IMAGE_LEVELS.smaller.quality }]);
    const out = await PDFDocument.load(new Uint8Array(await r.blob.arrayBuffer()));
    expect(out.getPageCount()).toBe(1);
    const images = [...out.context.enumerateIndirectObjects()].filter(([, o]) => o instanceof PDFRawStream && o.dict.get(PDFName.of("Subtype")) === PDFName.of("Image"));
    expect(images).toHaveLength(1);
    expect(String((images[0]?.[1] as PDFRawStream).dict.get(PDFName.of("Width")))).toBe("100");
  });

  it("returns the original, unchanged, when nothing gets smaller", async () => {
    const src = await pdfWithJpeg();
    const r = await compressKeepText(src, "scan.pdf", "balanced", uselessCodec);
    expect(r.unchanged).toBe(true);
    expect(r.filename).toBe("scan.pdf");
    expect(r.blob.size).toBe(src.length);
    expect(r.note).toMatch(/not be made noticeably smaller|not smaller/i);
  });

  it("explains when a PDF has no JPEG images at all", async () => {
    const src = fx("sample-3pages.pdf");
    const r = await compressKeepText(src, "text.pdf", "balanced", shrinkingCodec());
    expect(r.stats.imagesFound).toBe(0);
    expect(r.unchanged).toBe(true);
    expect(r.note).toMatch(/no JPEG images/i);
  });

  it("copes with a browser that cannot re-encode", async () => {
    const r = await compressKeepText(await pdfWithJpeg(), "scan.pdf", "balanced", unavailableCodec);
    expect(r.unchanged).toBe(true);
    expect(r.stats.imagesShrunk).toBe(0);
  });

  it("rejects encrypted and corrupt files with specific errors", async () => {
    await expect(compressKeepText(fx("encrypted.pdf"), "e.pdf", "balanced", shrinkingCodec())).rejects.toMatchObject({ code: "ENCRYPTED_PDF" });
    await expect(compressKeepText(fx("corrupt.pdf"), "c.pdf", "balanced", shrinkingCodec())).rejects.toMatchObject({ code: "CORRUPT_PDF" });
  });

  it("stops when cancelled", async () => {
    const c = new AbortController();
    c.abort();
    await expect(compressKeepText(await pdfWithJpeg(), "s.pdf", "balanced", shrinkingCodec(), undefined, c.signal)).rejects.toMatchObject({ code: "CANCELLED" });
  });
});

describe("compression settings", () => {
  it("levels get stricter, and the ladder goes from sharp to small", () => {
    expect(IMAGE_LEVELS.balanced.maxSide).toBeGreaterThan(IMAGE_LEVELS.smaller.maxSide);
    expect(IMAGE_LEVELS.smaller.quality).toBeGreaterThan(IMAGE_LEVELS.smallest.quality);
    for (let i = 1; i < RENDER_LADDER.length; i++) {
      expect(RENDER_LADDER[i]!.scale).toBeLessThanOrEqual(RENDER_LADDER[i - 1]!.scale);
      expect(RENDER_LADDER[i]!.quality).toBeLessThanOrEqual(RENDER_LADDER[i - 1]!.quality);
    }
    for (const idx of Object.values(LEVEL_START_INDEX)) expect(RENDER_LADDER[idx]).toBeDefined();
  });

  it("builds safe output names", () => {
    expect(outputName("My Report.PDF")).toBe("My Report-compressed.pdf");
    expect(outputName("a/b\\c.pdf")).toBe("a_b_c-compressed.pdf");
  });
});
