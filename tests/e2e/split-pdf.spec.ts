import JSZip from "jszip";
import { expect, test } from "@playwright/test";
import { PDFDocument } from "pdf-lib";
import { dismissConsent, download, fixture } from "./helpers";

test("extracts selected pages into one PDF", async ({ page }) => {
  await page.goto("/split-pdf/");
  await dismissConsent(page);
  await page.locator('input[type="file"]').setInputFiles(fixture("sample-3pages.pdf"));
  await expect(page.getByText(/3 pages/).first()).toBeVisible();
  await page.getByLabel("Pages", { exact: true }).fill("1, 3");
  await page.getByRole("button", { name: "Extract pages" }).click();
  const file = await download(page, () => page.getByRole("button", { name: /^Download/ }).click());
  expect((await PDFDocument.load(file.bytes)).getPageCount()).toBe(2);
});

test("splits every page into a ZIP", async ({ page }) => {
  await page.goto("/split-pdf/");
  await dismissConsent(page);
  await page.locator('input[type="file"]').setInputFiles(fixture("sample-3pages.pdf"));
  await expect(page.getByText(/3 pages/).first()).toBeVisible();
  await page.getByLabel("Every page as its own PDF").check();
  await page.getByRole("button", { name: "Split PDF" }).click();
  const file = await download(page, () => page.getByRole("button", { name: /^Download/ }).click());
  expect(file.name).toBe("split-pages.zip");
  expect(Object.keys((await JSZip.loadAsync(file.bytes)).files)).toHaveLength(3);
});

test("shows a clear message for an invalid range", async ({ page }) => {
  await page.goto("/split-pdf/");
  await dismissConsent(page);
  await page.locator('input[type="file"]').setInputFiles(fixture("sample-3pages.pdf"));
  await expect(page.getByText(/3 pages/).first()).toBeVisible();
  await page.getByLabel("Pages", { exact: true }).fill("9");
  await expect(page.getByText(/outside the document/i)).toBeVisible();
  await expect(page.getByRole("button", { name: "Extract pages" })).toBeDisabled();
});
