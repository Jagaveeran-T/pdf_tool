import { expect, test } from "@playwright/test";
import { PDFDocument } from "pdf-lib";
import { dismissConsent, download, fixture } from "./helpers";

test("merges two PDFs into one", async ({ page }) => {
  await page.goto("/merge-pdf/");
  await dismissConsent(page);
  await page.locator('input[type="file"]').setInputFiles([fixture("sample-3pages.pdf"), fixture("sample-2pages.pdf")]);
  await expect(page.getByText(/3 pages/)).toBeVisible();
  await expect(page.getByText(/2 pages/)).toBeVisible();

  await page.getByRole("button", { name: "Merge PDFs" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Your PDF is ready" })).toContainText("5 pages");
  const file = await download(page, () => page.getByRole("button", { name: /^Download/ }).click());
  expect((await PDFDocument.load(file.bytes)).getPageCount()).toBe(5);
});

test("explains why an encrypted or damaged PDF was refused, without crashing", async ({ page }) => {
  await page.goto("/merge-pdf/");
  await dismissConsent(page);
  await page.locator('input[type="file"]').setInputFiles([fixture("sample-3pages.pdf"), fixture("encrypted.pdf"), fixture("corrupt.pdf")]);
  // Each refused file gets its own message on its row (password-protected, or damaged / unreadable).
  await expect(page.getByText(/Remove it from the list/i)).toHaveCount(2);
  await expect(page.getByText(/Password-protected PDFs cannot be opened|could not be read/i).first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Merge PDFs" })).toBeDisabled();
});
