import { siteConfig } from "@/config/site";

type GtagFn = (...args: unknown[]) => void;
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: GtagFn;
  }
}

/** Only these events and parameters may ever be sent. File names and file contents are never accepted. */
export const ALLOWED_EVENTS = ["tool_started", "tool_completed", "tool_failed"] as const;
export type AllowedEvent = (typeof ALLOWED_EVENTS)[number];

export interface EventParams {
  tool?: "image-to-pdf" | "jpg-to-pdf" | "merge-pdf" | "split-pdf" | "compress-pdf";
  file_count?: number;
  error_code?: string;
}

const FILENAME_LIKE = /\.(pdf|jpe?g|png|webp|zip)\b|[\\/]/i;

export function sanitizeParams(params: EventParams): Record<string, string | number> {
  const out: Record<string, string | number> = {};
  if (params.tool) out.tool = params.tool;
  if (typeof params.file_count === "number" && Number.isFinite(params.file_count)) {
    out.file_count = Math.min(Math.max(0, Math.round(params.file_count)), 1000);
  }
  if (params.error_code && /^[A-Z_]{2,40}$/.test(params.error_code)) out.error_code = params.error_code;
  for (const v of Object.values(out)) {
    if (typeof v === "string" && FILENAME_LIKE.test(v)) throw new Error("Refusing to send filename-like value");
  }
  return out;
}

let loaded = false;

export function isAnalyticsLoaded(): boolean {
  return loaded;
}

export function loadAnalytics(): void {
  const id = siteConfig.gaId;
  if (loaded || !id || typeof document === "undefined") return;
  loaded = true;
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(s);
  window.gtag?.("js", new Date());
  window.gtag?.("config", id, { allow_google_signals: false, allow_ad_personalization_signals: false });
}

export function trackEvent(name: AllowedEvent, params: EventParams = {}): void {
  if (!loaded || typeof window === "undefined" || !window.gtag) return;
  if (!ALLOWED_EVENTS.includes(name)) return;
  try {
    window.gtag("event", name, sanitizeParams(params));
  } catch {
    /* never let analytics break a tool */
  }
}
