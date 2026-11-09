import { expect, test } from "@playwright/test";
import { PDFDocument } from "pdf-lib";
import { dismissConsent, download, fixture, trackRequests } from "./helpers";

test("flatten mode makes a valid PDF and never uploads the file", async ({ page }) => {
  const requests = trackRequests(page);
  await page.goto("/compress-pdf/");
  await dismissConsent(page);
  await page.locator('input[type="file"]').setInputFiles(fixture("sample-3pages.pdf"));
  await expect(page.getByText(/3 pages/).first()).toBeVisible();
  await page.getByRole("radio", { name: /Flatten pages to images/ }).check();
  await expect(page.getByText(/Flatten mode turns every page into a picture/)).toBeVisible();
  await page.getByRole("button", { name: "Compress PDF" }).click();
  await expect(page.getByRole("status")).toBeVisible({ timeout: 60_000 });
  const file = await download(page, () => page.getByRole("button", { name: /^Download/ }).click());
  expect((await PDFDocument.load(file.bytes)).getPageCount()).toBe(3);
  expect(requests.filter((r) => r.method() !== "GET" && r.method() !== "HEAD")).toHaveLength(0);
});

test("keep-text mode explains when a text-only PDF cannot shrink", async ({ page }) => {
  await page.goto("/compress-pdf/");
  await dismissConsent(page);
  await page.locator('input[type="file"]').setInputFiles(fixture("sample-3pages.pdf"));
  await expect(page.getByText(/3 pages/).first()).toBeVisible();
  await page.getByRole("button", { name: "Compress PDF" }).click();
  await expect(page.getByText(/could not make this file smaller/i)).toBeVisible({ timeout: 30_000 });
  await expect(page.getByRole("status").getByText(/no JPEG images/i)).toBeVisible();
});

test("an encrypted PDF is rejected with a clear message", async ({ page }) => {
  await page.goto("/compress-pdf/");
  await dismissConsent(page);
  await page.locator('input[type="file"]').setInputFiles(fixture("encrypted.pdf"));
  await expect(page.getByText(/password-protected or encrypted/i).first()).toBeVisible();
});

test("keep-text mode really shrinks a PDF that holds a large JPEG", async ({ page }) => {
  const sharp = (await import("sharp")).default;
  const w = 2400;
  const h = 1800;
  const noise = Buffer.alloc(w * h * 3);
  for (let i = 0; i < noise.length; i++) noise[i] = (i * 2654435761) % 251;
  const jpeg = await sharp(noise, { raw: { width: w, height: h, channels: 3 } }).jpeg({ quality: 95 }).toBuffer();
  const doc = await PDFDocument.create();
  const image = await doc.embedJpg(jpeg);
  doc.addPage([600, 450]).drawImage(image, { x: 0, y: 0, width: 600, height: 450 });
  const bytes = Buffer.from(await doc.save());

  await page.goto("/compress-pdf/");
  await dismissConsent(page);
  await page.locator('input[type="file"]').setInputFiles({ name: "photo-scan.pdf", mimeType: "application/pdf", buffer: bytes });
  await expect(page.getByText(/1 page/).first()).toBeVisible();
  await page.getByRole("radio", { name: /Smallest/ }).check();
  await page.getByRole("button", { name: "Compress PDF" }).click();
  await expect(page.getByText(/% smaller/)).toBeVisible({ timeout: 60_000 });
  const file = await download(page, () => page.getByRole("button", { name: /^Download/ }).click());
  expect(file.name).toBe("photo-scan-compressed.pdf");
  expect(file.bytes.length).toBeLessThan(bytes.length);
  expect((await PDFDocument.load(file.bytes)).getPageCount()).toBe(1);
});
