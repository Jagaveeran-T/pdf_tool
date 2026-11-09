import { expect, test } from "@playwright/test";

const PAGES = [
  "/", "/image-to-pdf/", "/jpg-to-pdf/", "/merge-pdf/", "/split-pdf/", "/compress-pdf/", "/blog/", "/guides/", "/faq/", "/about/", "/contact/",
  "/privacy-policy/", "/cookie-policy/", "/terms/", "/disclaimer/", "/sitemap-page/",
  "/blog/jpg-vs-png-for-pdf/", "/guides/merge-pdf-guide/",
];

test.describe("metadata", () => {
  const titles = new Map<string, string>();
  const descriptions = new Map<string, string>();

  for (const path of PAGES) {
    test(`${path} has a unique title, description and a canonical URL`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      const title = await page.title();
      const desc = (await page.locator('meta[name="description"]').getAttribute("content")) ?? "";
      const canonical = (await page.locator('link[rel="canonical"]').getAttribute("href")) ?? "";
      expect(title.length).toBeGreaterThan(10);
      expect(desc.length).toBeGreaterThan(50);
      expect(canonical).toMatch(/^https:\/\/.+\/$|^https:\/\/[^/]+$/);
      expect(new URL(canonical).pathname).toBe(path);
      expect(titles.get(title), `duplicate title: ${title}`).toBeUndefined();
      expect(descriptions.get(desc), `duplicate description on ${path}`).toBeUndefined();
      titles.set(title, path);
      descriptions.set(desc, path);
    });
  }
});

test("every page links to every legal page and has a manage-cookies control", async ({ page }) => {
  for (const path of ["/", "/image-to-pdf/", "/blog/jpg-vs-png-for-pdf/", "/contact/"]) {
    await page.goto(path);
    const footer = page.locator("footer");
    for (const href of ["/privacy-policy/", "/cookie-policy/", "/terms/", "/disclaimer/", "/about/", "/contact/", "/sitemap-page/"]) {
      await expect(footer.locator(`a[href="${href}"]`), `${path} footer -> ${href}`).toHaveCount(1);
    }
    await expect(footer.getByRole("button", { name: /manage cookies/i })).toBeVisible();
  }
});

test("ads.txt, robots.txt, sitemap.xml and the self-hosted pdf.js worker are reachable", async ({ request }) => {
  const ads = await request.get("/ads.txt");
  expect(ads.status()).toBe(200);
  expect(ads.headers()["content-type"]).toContain("text/plain");
  const adsText = await ads.text();
  expect(/^google\.com, pub-\d+, DIRECT, f08c47fec0942fa0$/m.test(adsText) || /^# PENDING/m.test(adsText)).toBe(true);

  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toMatch(/Sitemap: https:\/\/.+\/sitemap\.xml/);
  const sm = await (await request.get("/sitemap.xml")).text();
  for (const p of ["/image-to-pdf/", "/blog/fix-common-pdf-errors/", "/guides/split-pdf-guide/"]) expect(sm).toContain(p);
  expect((await request.get("/pdf.worker.min.mjs")).status()).toBe(200);
});

test("the 404 page is custom and offers navigation", async ({ page }) => {
  const res = await page.goto("/this-page-does-not-exist/");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: /image to pdf/i }).first()).toBeVisible();
});

test("there is no ad markup anywhere while ads are disabled, and no placeholder wording", async ({ page }) => {
  for (const path of ["/", "/merge-pdf/", "/blog/fix-common-pdf-errors/", "/privacy-policy/"]) {
    await page.goto(path);
    await expect(page.locator("ins.adsbygoogle")).toHaveCount(0);
    expect(await page.locator("body").innerText()).not.toMatch(/lorem ipsum|coming soon|TODO/i);
  }
});

test("article pages carry Article and BreadcrumbList structured data", async ({ page }) => {
  await page.goto("/blog/jpg-vs-png-for-pdf/");
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  const all = blocks.join(" ");
  expect(all).toContain('"Article"');
  expect(all).toContain('"BreadcrumbList"');
});
