import { describe, expect, it } from "vitest";
import { adsConfig, isPathBlocked, isPlacementAllowed, publisherIdForAdsTxt } from "@/config/ads";

describe("ad placement rules", () => {
  it("is disabled by default, so nothing renders until approval", () => {
    expect(adsConfig.enabled).toBe(false);
  });

  it("allows at most one unit per page and none above the tool", () => {
    expect(adsConfig.maxPerPage).toBe(1);
    expect(isPlacementAllowed("tool", "tool-below")).toBe(true);
    expect(isPlacementAllowed("tool", "article")).toBe(false);
    expect(isPlacementAllowed("article", "article")).toBe(true);
    expect(Object.keys(adsConfig.allowed)).not.toContain("legal");
  });

  it.each(["/privacy-policy/", "/cookie-policy/", "/terms/", "/disclaimer/", "/contact/", "/about/", "/faq/", "/sitemap-page/", "/404"])(
    "blocks ads on %s",
    (p) => expect(isPathBlocked(p.replace(/\/$/, "") || "/")).toBe(true),
  );

  it("does not block tool, blog or guide pages", () => {
    for (const p of ["/image-to-pdf", "/merge-pdf", "/blog/jpg-vs-png-for-pdf", "/guides/merge-pdf-guide"]) expect(isPathBlocked(p)).toBe(false);
  });

  it("hides ads while a tool is empty, processing, showing an error or offering a download", () => {
    expect(adsConfig.hiddenWhenToolStatus).toEqual(expect.arrayContaining(["idle", "processing", "error", "done"]));
  });

  it("strips ca- from the publisher ID for ads.txt", () => {
    expect(publisherIdForAdsTxt()).not.toMatch(/^ca-/);
  });
});
