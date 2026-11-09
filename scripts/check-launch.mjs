// Run before launch: `npm run check:launch`. Exits 1 while any launch blocker remains.
// Reads NEXT_PUBLIC_* values from the environment, falling back to .env.local, and inspects the built output when present.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const env = { ...process.env };
const envFile = join(root, ".env.local");
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const m = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim());
    if (m && env[m[1]] === undefined) env[m[1]] = m[2];
  }
}
const v = (k) => (env[k] ?? "").trim();
const problems = [];
const warnings = [];

const url = v("NEXT_PUBLIC_SITE_URL");
if (!url) problems.push("NEXT_PUBLIC_SITE_URL is empty.");
else {
  if (!/^https:\/\//.test(url)) problems.push("NEXT_PUBLIC_SITE_URL must start with https://");
  if (/example\.(com|org|net)|localhost|pages\.dev/.test(url)) problems.push(`NEXT_PUBLIC_SITE_URL (${url}) is a placeholder or a *.pages.dev address. AdSense needs your own domain.`);
}
if (!v("NEXT_PUBLIC_SITE_NAME")) problems.push("NEXT_PUBLIC_SITE_NAME is empty.");
const email = v("NEXT_PUBLIC_CONTACT_EMAIL");
if (!email) problems.push("NEXT_PUBLIC_CONTACT_EMAIL is empty.");
else if (/example\.(com|org|net)/.test(email)) problems.push("NEXT_PUBLIC_CONTACT_EMAIL is a placeholder.");

if (v("NEXT_PUBLIC_ADS_ENABLED") === "true") {
  if (!/^(ca-)?pub-\d{10,20}$/.test(v("NEXT_PUBLIC_ADSENSE_ID"))) problems.push("Ads are enabled but NEXT_PUBLIC_ADSENSE_ID is not a valid publisher ID.");
  if (!v("NEXT_PUBLIC_AD_SLOT_TOOL_BELOW") && !v("NEXT_PUBLIC_AD_SLOT_ARTICLE")) warnings.push("Ads are enabled but no ad slot IDs are set, so no ad will render.");
} else {
  warnings.push("Ads are disabled (NEXT_PUBLIC_ADS_ENABLED is not true). That is correct until AdSense approves the site.");
}
if (v("NEXT_PUBLIC_CMP_MODE") !== "google-fc") warnings.push('NEXT_PUBLIC_CMP_MODE is not "google-fc". The built-in banner is not Google-certified, so ads there are non-personalised only. Use google-fc to serve EEA/UK/CH traffic with personalised ads.');
if (!v("NEXT_PUBLIC_WEB3FORMS_KEY")) warnings.push("No contact form key: the contact page shows a mailto button only. That is acceptable.");

const adsTxt = join(root, "public", "ads.txt");
if (!existsSync(adsTxt)) problems.push("public/ads.txt is missing. Run `npm run assets`.");
else if (v("NEXT_PUBLIC_ADS_ENABLED") === "true" && !/^google\.com, pub-\d+, DIRECT, f08c47fec0942fa0/m.test(readFileSync(adsTxt, "utf8")))
  problems.push("public/ads.txt does not contain your google.com DIRECT line. Rebuild with NEXT_PUBLIC_ADSENSE_ID set.");

// Scan the built site for leftover placeholder text.
const out = join(root, "out");
if (existsSync(out)) {
  const bad = /(lorem ipsum|coming soon|your-domain|yourdomain\.com|hello@example\.com|TODO|PLACEHOLDER)/i;
  const walk = (dir) => {
    for (const f of readdirSync(dir)) {
      const p = join(dir, f);
      if (statSync(p).isDirectory()) walk(p);
      else if (p.endsWith(".html")) {
        const m = bad.exec(readFileSync(p, "utf8").replace(/<script[\s\S]*?<\/script>/g, ""));
        if (m) problems.push(`Placeholder text "${m[0]}" found in ${p.replace(root + "/", "")}`);
      }
    }
  };
  walk(out);
} else warnings.push("No ./out build found, so the placeholder-text scan was skipped. Run `npm run build` first.");

for (const w of warnings) console.log(`warning: ${w}`);
for (const p of problems) console.error(`BLOCKER: ${p}`);
if (problems.length) {
  console.error(`\n${problems.length} launch blocker(s). Fix them before you apply to AdSense.`);
  process.exit(1);
}
console.log("\nNo launch blockers found. Now work through the manual checklist in the README.");
