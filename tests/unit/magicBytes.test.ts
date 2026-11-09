import { describe, expect, it } from "vitest";
import { detectFileType } from "@/lib/magicBytes";

const bytes = (...n: number[]) => new Uint8Array(n);

describe("detectFileType", () => {
  it("recognises JPEG, PNG, WebP and PDF by content", () => {
    expect(detectFileType(bytes(0xff, 0xd8, 0xff, 0xe0))).toBe("jpeg");
    expect(detectFileType(bytes(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a))).toBe("png");
    expect(detectFileType(new TextEncoder().encode("RIFF\u0000\u0000\u0000\u0000WEBPVP8 "))).toBe("webp");
    expect(detectFileType(new TextEncoder().encode("%PDF-1.7\n"))).toBe("pdf");
  });

  it("allows a few junk bytes before the PDF header", () => {
    expect(detectFileType(new TextEncoder().encode("\n\n  %PDF-1.4"))).toBe("pdf");
  });

  it("rejects everything else, whatever the file name says", () => {
    expect(detectFileType(new TextEncoder().encode("hello world, not a document"))).toBeNull();
    expect(detectFileType(new Uint8Array(0))).toBeNull();
    // RIFF container that is not WebP (for example WAV audio)
    expect(detectFileType(new TextEncoder().encode("RIFF\u0000\u0000\u0000\u0000WAVEfmt "))).toBeNull();
  });
});
