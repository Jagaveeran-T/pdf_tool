import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PDFDocument } from "pdf-lib";
import { describe, expect, it } from "vitest";
import { mergePdfs } from "@/processing/operations/merge";

const fx = (n: string) => new Uint8Array(readFileSync(join(__dirname, "../fixtures", n)));
const three = { name: "three.pdf", bytes: fx("sample-3pages.pdf") };
const two = { name: "two.pdf", bytes: fx("sample-2pages.pdf") };

const load = async (r: { blob: Blob }) => PDFDocument.load(new Uint8Array(await r.blob.arrayBuffer()));

describe("mergePdfs", () => {
  it("joins files in the given order", async () => {
    const r = await mergePdfs([three, two]);
    expect(r.pageCount).toBe(5);
    expect((await load(r)).getPageCount()).toBe(5);
    const reversed = await mergePdfs([two, three]);
    expect((await load(reversed)).getPageCount()).toBe(5);
  });

  it("applies a per-file rotation to every page of that file only", async () => {
    const doc = await load(await mergePdfs([{ ...three, rotation: 90 }, two]));
    expect(doc.getPages().map((p) => p.getRotation().angle)).toEqual([90, 90, 90, 0, 0]);
  });

  it("needs at least two files", async () => {
    await expect(mergePdfs([three])).rejects.toMatchObject({ code: "EMPTY" });
  });

  it("rejects an encrypted PDF and names the file", async () => {
    const err = await mergePdfs([three, { name: "locked.pdf", bytes: fx("encrypted.pdf") }]).catch((e) => e);
    expect(err.code).toBe("ENCRYPTED_PDF");
    expect(err.message).toContain("locked.pdf");
  });

  it("rejects a corrupt PDF and names the file", async () => {
    const err = await mergePdfs([three, { name: "broken.pdf", bytes: fx("corrupt.pdf") }]).catch((e) => e);
    expect(err.code).toBe("CORRUPT_PDF");
    expect(err.message).toContain("broken.pdf");
  });
});
