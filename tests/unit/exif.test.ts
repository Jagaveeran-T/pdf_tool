import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { readJpegOrientation } from "@/lib/exif";

const fx = (n: string) => new Uint8Array(readFileSync(join(__dirname, "../fixtures", n)));

describe("readJpegOrientation", () => {
  it("returns 1 for a JPEG without an orientation flag", () => {
    expect(readJpegOrientation(fx("sample.jpg"))).toBe(1);
  });
  it("reads the EXIF orientation flag", () => {
    expect(readJpegOrientation(fx("sample-exif-rotated.jpg"))).toBe(6);
  });
  it("returns 1 for data that is not a JPEG or is truncated", () => {
    expect(readJpegOrientation(new Uint8Array([1, 2, 3]))).toBe(1);
    expect(readJpegOrientation(fx("sample-exif-rotated.jpg").subarray(0, 30))).toBe(1);
  });
});
