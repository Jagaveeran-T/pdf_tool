/**
 * Site-wide identity. Everything comes from environment variables so nothing has to be edited in code.
 * `npm run check:launch` (scripts/check-launch.mjs) refuses to pass while required values are still defaults.
 */
const env = (v: string | undefined, fallback = "") => (v && v.trim() ? v.trim() : fallback);

export const siteConfig = {
  name: env(process.env.NEXT_PUBLIC_SITE_NAME, "PDFNook"),
  tagline: "Free PDF tools that run in your browser",
  url: env(process.env.NEXT_PUBLIC_SITE_URL, "http://localhost:3000").replace(/\/+$/, ""),
  email: env(process.env.NEXT_PUBLIC_CONTACT_EMAIL, "hello@example.com"),
  targetRegions: env(process.env.NEXT_PUBLIC_TARGET_REGIONS, "worldwide"),
  /** Web3Forms access key. When empty the contact page shows a mailto button instead of a form. */
  web3formsKey: env(process.env.NEXT_PUBLIC_WEB3FORMS_KEY),
  gaId: env(process.env.NEXT_PUBLIC_GA_ID),
  sentryDsn: env(process.env.NEXT_PUBLIC_SENTRY_DSN),
  lastUpdated: "8 November 2026",
  lastUpdatedISO: "2026-11-08",
} as const;

export const absoluteUrl = (path = "/"): string => {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${p}`;
};
