/**
 * Backs the "files are processed in your browser" claim:
 *  1. the code that touches user files contains no network calls, and
 *  2. the Content-Security-Policy only lists the origins the site really needs (no wildcard connect-src).
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = join(__dirname, "../..");
const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : /\.(ts|tsx)$/.test(f) ? [p] : [];
  });

const NETWORK = /\b(fetch\s*\(|XMLHttpRequest|navigator\.sendBeacon|new WebSocket|new EventSource)/;

describe("no file data leaves the browser", () => {
  it.each(["processing", "features", "hooks"])("%s/ contains no network calls", (folder) => {
    for (const file of walk(join(root, folder))) {
      expect(NETWORK.test(readFileSync(file, "utf8")), `${file} makes a network call`).toBe(false);
    }
  });

  it("the only fetch() in the app is the contact form, which sends no files", () => {
    const hits = ["app", "components", "lib", "config"].flatMap((d) => walk(join(root, d))).filter((f) => NETWORK.test(readFileSync(f, "utf8")));
        expect(hits.map((h) => h.replace(root, "").replace(/\\/g, "/"))).toEqual(["/components/common/ContactForm.tsx"]);
        expect(readFileSync(join(root, "components/common/ContactForm.tsx"), "utf8")).not.toMatch(/\.(file|files)\b|FormData\(\s*\)\.append\([^)]*file/i);
      });

  it("the CSP has a restrictive connect-src and no wildcard", () => {
    const headers = readFileSync(join(root, "public/_headers"), "utf8");
    const csp = /Content-Security-Policy:\s*(.+)/.exec(headers)?.[1] ?? "";
    expect(csp).not.toBe("");
    const connect = /connect-src ([^;]+)/.exec(csp)?.[1]?.split(/\s+/) ?? [];
    expect(connect).toContain("'self'");
    expect(connect).not.toContain("*");
    expect(connect).not.toContain("https:");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("worker-src 'self' blob:");
  });
});
