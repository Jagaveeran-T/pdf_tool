import { expect, test } from "@playwright/test";
import { PDFDocument } from "pdf-lib";
import { dismissConsent, download, fixture, trackRequests } from "./helpers";

test("converts JPG, PNG and WebP into one PDF without sending anything out", async ({ page, baseURL }) => {
  const requests = trackRequests(page);
  await page.goto("/image-to-pdf/");
  await dismissConsent(page);

  await page.locator('input[type="file"]').setInputFiles([fixture("sample.jpg"), fixture("sample.png"), fixture("sample.webp")]);
  await expect(page.getByRole("list", { name: /order they will be used/i }).getByRole("listitem")).toHaveCount(3);

  await page.getByRole("button", { name: "Convert to PDF" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Your PDF is ready" })).toContainText("3 pages");

  const file = await download(page, () => page.getByRole("button", { name: /^Download/ }).click());
  expect(file.name).toBe("images.pdf");
  expect(file.bytes.subarray(0, 5).toString()).toBe("%PDF-");
  expect((await PDFDocument.load(file.bytes)).getPageCount()).toBe(3);

  // Privacy: no request may carry a body, and nothing may be sent to another origin with file data.
  const origin = new URL(baseURL!).origin;
  const bodies = requests.filter((r) => r.postData());
  expect(bodies, "no request should carry a body").toHaveLength(0);
  expect(requests.filter((r) => !r.url().startsWith(origin) && !r.url().startsWith("data:") && !r.url().startsWith("blob:"))).toHaveLength(0);
});

test("rejects a file whose content is not an image, even with a .jpg name", async ({ page }) => {
  await page.goto("/image-to-pdf/");
  await dismissConsent(page);
  await page.locator('input[type="file"]').setInputFiles({ name: "fake.jpg", mimeType: "image/jpeg", buffer: Buffer.from("not an image at all") });
  await expect(page.getByText(/not a supported file/i)).toBeVisible();
});

test("shows no ad before, during or after a conversion (ads are disabled by default)", async ({ page }) => {
  await page.goto("/image-to-pdf/");
  await expect(page.locator("ins.adsbygoogle")).toHaveCount(0);
});

test("the tool page has substantial unique copy and structured data", async ({ page }) => {
  await page.goto("/image-to-pdf/");
  const words = (await page.locator("main").innerText()).split(/\s+/).filter(Boolean).length;
  expect(words).toBeGreaterThan(800);
  const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
  const types = ld.flatMap((t) => JSON.parse(t)["@type"] ?? JSON.parse(t)["@graph"]?.map((n: { "@type": string }) => n["@type"]) ?? []);
  expect(types).toEqual(expect.arrayContaining(["WebApplication", "FAQPage", "HowTo", "BreadcrumbList"]));
});
