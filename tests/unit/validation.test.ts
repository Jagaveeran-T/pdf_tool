import { describe, expect, it } from "vitest";
import { validateFiles, type ValidationRules } from "@/lib/fileValidation";

const JPG = [0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0];
const PDF = Array.from(new TextEncoder().encode("%PDF-1.4\n"));
const file = (name: string, bytes: number[], pad = 0) => new File([new Uint8Array([...bytes, ...new Array(pad).fill(0)])], name);

const rules: ValidationRules = { accept: ["jpeg"], maxFileBytes: 1000, maxFiles: 2, maxTotalBytes: 1500 };

describe("validateFiles", () => {
  it("accepts a real JPEG", async () => {
    const r = await validateFiles([file("a.jpg", JPG)], rules);
    expect(r.accepted).toHaveLength(1);
    expect(r.rejected).toHaveLength(0);
  });

  it("checks content, not the extension", async () => {
    const r = await validateFiles([file("fake.jpg", PDF)], rules);
    expect(r.accepted).toHaveLength(0);
    expect(r.rejected[0]?.code).toBe("UNSUPPORTED_TYPE");
  });

  it("rejects empty files", async () => {
    const r = await validateFiles([new File([], "empty.jpg")], rules);
    expect(r.rejected[0]?.code).toBe("EMPTY");
  });

  it("enforces size limits per file and in total", async () => {
    const big = await validateFiles([file("big.jpg", JPG, 2000)], rules);
    expect(big.rejected[0]?.code).toBe("TOO_LARGE");
    const total = await validateFiles([file("a.jpg", JPG, 900), file("b.jpg", JPG, 900)], rules);
    expect(total.accepted).toHaveLength(1);
    expect(total.rejected[0]?.code).toBe("TOTAL_TOO_LARGE");
  });

  it("enforces the file count, counting files already in the list", async () => {
    const r = await validateFiles([file("a.jpg", JPG), file("b.jpg", JPG)], rules, { count: 1, totalBytes: 10 });
    expect(r.accepted).toHaveLength(1);
    expect(r.rejected[0]?.code).toBe("TOO_MANY_FILES");
  });
});
