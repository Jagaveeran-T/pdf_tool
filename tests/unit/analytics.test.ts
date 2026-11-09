import { describe, expect, it } from "vitest";
import { ALLOWED_EVENTS, sanitizeParams, trackEvent } from "@/lib/analytics";

describe("analytics privacy rules", () => {
  it("only knows three coarse events", () => {
    expect([...ALLOWED_EVENTS]).toEqual(["tool_started", "tool_completed", "tool_failed"]);
  });

  it("keeps only the tool name, a bounded file count and an error code", () => {
    expect(sanitizeParams({ tool: "merge-pdf", file_count: 3, error_code: "ENCRYPTED_PDF" })).toEqual({
      tool: "merge-pdf",
      file_count: 3,
      error_code: "ENCRYPTED_PDF",
    });
    expect(sanitizeParams({ tool: "merge-pdf", file_count: 99999 }).file_count).toBe(1000);
  });

  it("drops anything that is not a plain error code, such as a file name", () => {
    const out = sanitizeParams({ tool: "split-pdf", error_code: "my-tax-return.pdf" });
    expect(out).toEqual({ tool: "split-pdf" });
    expect(JSON.stringify(out)).not.toMatch(/pdf\b.*pdf/);
  });

  it("does nothing before consent has loaded analytics", () => {
    expect(() => trackEvent("tool_started", { tool: "split-pdf" })).not.toThrow();
  });
});
