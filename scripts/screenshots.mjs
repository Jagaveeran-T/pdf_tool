// Captures real screenshots of the running tools into public/images (used by the articles).
// Usage: npm run build && npm run screenshots && npm run build   (rebuild so the images are copied into out/)
// Requires the Playwright browsers (npx playwright install chromium) and the fixtures from `npm test`.
import { spawn } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "@playwright/test";

const root = process.cwd();
const port = 4180;
const base = `http://localhost:${port}`;
const fx = (n) => join(root, "tests", "fixtures", n);
const outDir = join(root, "public", "images");
mkdirSync(outDir, { recursive: true });
if (!existsSync(join(root, "out"))) throw new Error("Run `npm run build` first: the screenshots are taken from out/.");
if (!existsSync(fx("sample.jpg"))) throw new Error("Fixtures missing. Run `npm test` once to generate them.");

const server = spawn("npx", ["serve", "out", "-l", String(port), "--no-clipboard"], { stdio: "ignore", shell: process.platform === "win32" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
for (let i = 0; i < 60; i++) {
  try { if ((await fetch(base)).ok) break; } catch {}
  await sleep(500);
}

const browser = await chromium.launch();
try {
  const ctx = await browser.newContext({ viewport: { width: 1000, height: 900 }, deviceScaleFactor: 1.5 });
  // Pre-set a consent choice so the banner is not part of the screenshots.
  await ctx.addInitScript(() => localStorage.setItem("consent.v1", JSON.stringify({ v: 1, analytics: false, ads: false })));

  const shots = [
    { path: "/image-to-pdf/", files: ["sample.jpg", "sample.png", "sample.webp"], name: "image-to-pdf-tool.png", wait: /1\.|KB/ },
    { path: "/jpg-to-pdf/", files: ["sample.jpg", "sample-exif-rotated.jpg"], name: "jpg-to-pdf-tool.png", wait: /KB/ },
    { path: "/merge-pdf/", files: ["sample-3pages.pdf", "sample-2pages.pdf"], name: "merge-pdf-tool.png", wait: /3 pages/ },
    { path: "/split-pdf/", files: ["sample-3pages.pdf"], name: "split-pdf-tool.png", wait: /3 pages/ },
  ];
  for (const s of shots) {
    const page = await ctx.newPage();
    await page.goto(base + s.path, { waitUntil: "networkidle" });
    await page.locator('input[type="file"]').setInputFiles(s.files.map(fx));
    await page.getByText(s.wait).first().waitFor();
    await page.waitForTimeout(1200); // let thumbnails render
    await page.locator('section[aria-label$=" tool"]').screenshot({ path: join(outDir, s.name) });
    console.log("saved", s.name);
    await page.close();
  }
} finally {
  await browser.close();
  server.kill();
}
