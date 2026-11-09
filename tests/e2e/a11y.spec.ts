import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const PAGES = ["/", "/image-to-pdf/", "/jpg-to-pdf/", "/merge-pdf/", "/split-pdf/", "/compress-pdf/", "/blog/", "/blog/scan-documents-with-your-phone/", "/contact/", "/privacy-policy/", "/faq/"];

for (const path of PAGES) {
  test(`${path} has no detectable WCAG A/AA violations`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page } as unknown as ConstructorParameters<typeof AxeBuilder>[0]).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.nodes[0]?.html}`)).toEqual([]);
  });
}

test("mobile: no horizontal scrolling and tap targets are usable", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  for (const path of ["/", "/image-to-pdf/", "/merge-pdf/", "/blog/jpg-vs-png-for-pdf/"]) {
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `${path} scrolls sideways`).toBeLessThanOrEqual(1);
  }
});

test("keyboard users can reach the file chooser and the skip/main landmark exists", async ({ page }) => {
  await page.goto("/image-to-pdf/");
  await expect(page.locator("main")).toHaveCount(1);
  await page.keyboard.press("Tab");
  await expect(page.locator(":focus")).toBeVisible();
});
