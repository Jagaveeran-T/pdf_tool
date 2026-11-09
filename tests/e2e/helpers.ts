import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Page, Request } from "@playwright/test";

export const fixture = (name: string) => join(__dirname, "../fixtures", name);
export const fixtureBytes = (name: string) => readFileSync(fixture(name));

/** Hosts the page may legitimately contact. Anything else, or any request carrying a body, fails the privacy tests. */
export function trackRequests(page: Page) {
  const requests: Request[] = [];
  page.on("request", (r) => requests.push(r));
  return requests;
}

export async function dismissConsent(page: Page) {
  const reject = page.getByRole("button", { name: "Reject all" });
  if (await reject.isVisible().catch(() => false)) await reject.click();
}

export async function download(page: Page, click: () => Promise<void>) {
  const [dl] = await Promise.all([page.waitForEvent("download"), click()]);
  const path = await dl.path();
  return { name: dl.suggestedFilename(), bytes: readFileSync(path!) };
}
