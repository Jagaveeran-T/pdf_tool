import { expect, test } from "@playwright/test";

test("Consent Mode v2 defaults are denied before any choice is made", async ({ page }) => {
  await page.goto("/");
  const consentCalls = await page.evaluate(() =>
    ((window as unknown as { dataLayer: IArguments[] }).dataLayer ?? []).map((a) => Array.from(a)).filter((a) => a[0] === "consent"),
  );
  const def = consentCalls.find((c) => c[1] === "default");
  expect(def?.[2]).toMatchObject({ ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "denied" });
  await expect(page.getByRole("dialog", { name: "Your privacy choices" })).toBeVisible();
});

test("no Google ad or analytics script is requested before consent", async ({ page }) => {
  const urls: string[] = [];
  page.on("request", (r) => urls.push(r.url()));
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  expect(urls.filter((u) => /googlesyndication|googletagmanager|google-analytics|fundingchoices/.test(u))).toEqual([]);
});

test("rejecting keeps everything denied and the choice is remembered", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Reject all" }).click();
  await expect(page.getByRole("dialog", { name: "Your privacy choices" })).toBeHidden();
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("consent.v1") ?? "{}"));
  expect(stored).toMatchObject({ analytics: false, ads: false });
  await page.reload();
  await expect(page.getByRole("dialog", { name: "Your privacy choices" })).toBeHidden();
});

test("accepting sends a consent update, and Manage cookies reopens the choices", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Accept all" }).click();
  const update = await page.evaluate(() =>
    ((window as unknown as { dataLayer: IArguments[] }).dataLayer ?? []).map((a) => Array.from(a)).filter((a) => a[0] === "consent" && a[1] === "update"),
  );
  expect(update.length).toBeGreaterThan(0);
  await page.getByRole("button", { name: /manage cookies/i }).click();
  await expect(page.getByRole("dialog", { name: "Your privacy choices" })).toBeVisible();
  await expect(page.getByRole("checkbox", { name: /Advertising/ })).toBeChecked();
});
