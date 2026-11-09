import { siteConfig } from "@/config/site";

const FILE_NAME = /[^\s/\\"'<>|:*?]+\.(pdf|jpe?g|png|webp|zip)\b/gi;
/** Quoted names may contain spaces ("tax return 2025.pdf"); this app always quotes file names in its own messages. */
const QUOTED_FILE_NAME = /(["'`])[^"'`\n]{1,255}\.(pdf|jpe?g|png|webp|zip)\1/gi;

/** Recursively replaces anything that looks like a file name. Exported for tests. */
export function scrubValue<T>(value: T): T {
  if (typeof value === "string") return value.replace(QUOTED_FILE_NAME, "[file]").replace(FILE_NAME, "[file]") as unknown as T;
  if (Array.isArray(value)) return value.map(scrubValue) as unknown as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) out[k] = scrubValue(v);
    return out as T;
  }
  return value;
}

export interface ScrubbableEvent {
  request?: unknown;
  user?: unknown;
  breadcrumbs?: unknown;
  extra?: unknown;
  contexts?: unknown;
  [key: string]: unknown;
}

/** Removes request data, user data, breadcrumbs and extra payloads, then scrubs file names from what remains. */
export function scrubEvent<T extends ScrubbableEvent>(event: T): T {
  const copy: ScrubbableEvent = { ...event };
  delete copy.request;
  delete copy.user;
  delete copy.breadcrumbs;
  delete copy.extra;
  delete copy.contexts;
  return scrubValue(copy) as T;
}

type SentryModule = typeof import("@sentry/browser");
let sentry: SentryModule | null = null;

export async function initSentry(): Promise<void> {
  if (sentry || !siteConfig.sentryDsn) return;
  const mod = await import("@sentry/browser");
  mod.init({
    dsn: siteConfig.sentryDsn,
    sendDefaultPii: false,
    tracesSampleRate: 0,
    maxBreadcrumbs: 0,
    integrations: (defaults) => defaults.filter((i) => i.name !== "Breadcrumbs"),
    beforeSend: (event) => scrubEvent(event as unknown as ScrubbableEvent) as unknown as typeof event,
  });
  sentry = mod;
}

export function reportError(error: unknown): void {
  sentry?.captureException(error);
}
