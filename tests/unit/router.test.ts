import { describe, expect, it, vi } from "vitest";
import { createRouter } from "@/processing/router/processingRouter";
import type { ProcessingProvider } from "@/processing/contracts/provider";
import { ProcessingError } from "@/processing/contracts/errors";

const okResult = { blob: new Blob(["x"]), filename: "x.pdf", mimeType: "application/pdf" };
const make = () => {
  const run = vi.fn(async () => okResult);
  return { run, router: createRouter({ run } as unknown as ProcessingProvider) };
};
const pdf = () => new File([new Uint8Array([0x25, 0x50, 0x44, 0x46])], "a.pdf");

describe("processing router", () => {
  it("passes a valid payload to the provider", async () => {
    const { router, run } = make();
    await router.run({ operation: "split-pdf", file: pdf(), mode: "each-page" });
    expect(run).toHaveBeenCalledOnce();
  });

  it("rejects unknown operations and malformed payloads before any work happens", async () => {
    const { router, run } = make();
    await expect(router.run({ operation: "compress-pdf", file: pdf() })).rejects.toMatchObject({ code: "INVALID_PAYLOAD" });
    await expect(router.run({ operation: "merge-pdf", files: [pdf()] })).rejects.toBeInstanceOf(ProcessingError);
    await expect(router.run(null)).rejects.toMatchObject({ code: "INVALID_PAYLOAD" });
    expect(run).not.toHaveBeenCalled();
  });

  it("rejects a rotations array that does not match the files", async () => {
    const { router } = make();
    await expect(router.run({ operation: "merge-pdf", files: [pdf(), pdf()], rotations: [0] })).rejects.toMatchObject({ code: "INVALID_PAYLOAD" });
  });
});
