import { describe, expect, it } from "vitest";
import { scrubEvent, scrubValue } from "@/lib/sentry";

describe("Sentry scrubbing", () => {
  it("replaces anything that looks like a file name", () => {
    expect(scrubValue('Failed to read passport-scan.JPG and "tax return 2025.pdf"')).not.toMatch(/passport|tax|2025/);
    expect(scrubValue("Failed to read passport-scan.jpg")).toContain("[file]");
  });

  it("scrubs nested values", () => {
    const out = scrubValue({ a: ["x/y/secret.pdf"], b: { c: "report.png" } });
    expect(JSON.stringify(out)).not.toMatch(/secret|report/);
  });

  it("removes request data, user, breadcrumbs, extra and contexts, and scrubs the message", () => {
    const event = scrubEvent({
      message: 'could not open "my contract.pdf"',
      request: { url: "https://x/?file=a.pdf" },
      user: { ip_address: "1.2.3.4" },
      breadcrumbs: [{ message: "clicked b.pdf" }],
      extra: { name: "c.pdf" },
      contexts: { file: { name: "d.pdf" } },
    });
    expect(event).not.toHaveProperty("request");
    expect(event).not.toHaveProperty("user");
    expect(event).not.toHaveProperty("breadcrumbs");
    expect(event).not.toHaveProperty("extra");
    expect(event).not.toHaveProperty("contexts");
    expect(event.message).toBe("could not open [file]");
  });
});
