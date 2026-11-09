/**
 * AdSense configuration and placement rules.
 * Everything is OFF by default. Flip NEXT_PUBLIC_ADS_ENABLED=true only after AdSense approves the site.
 */
export type PageType = "tool" | "article";
export type Placement = "tool-below" | "article";

const clean = (v: string | undefined) => (v ?? "").trim();

/** Accepts "pub-123..." or "ca-pub-123..." and always returns the "ca-pub-..." form (or ""). */
function normaliseClientId(v: string): string {
  const m = /^(?:ca-)?(pub-\d{10,20})$/.exec(v);
  return m ? `ca-${m[1]}` : "";
}

export const adsConfig = {
  enabled: clean(process.env.NEXT_PUBLIC_ADS_ENABLED) === "true",
  /** "ca-pub-XXXXXXXXXXXXXXXX", or "" while no valid ID is configured */
  clientId: normaliseClientId(clean(process.env.NEXT_PUBLIC_ADSENSE_ID)),
  slots: {
    "tool-below": clean(process.env.NEXT_PUBLIC_AD_SLOT_TOOL_BELOW),
    article: clean(process.env.NEXT_PUBLIC_AD_SLOT_ARTICLE),
  } satisfies Record<Placement, string>,
  /** Reserved height in px per placement, so ads never push content around (CLS). */
  minHeight: { "tool-below": 280, article: 280 } satisfies Record<Placement, number>,
  /** Hard cap of ad units per page. Tool pages: 1. Article pages: 1. Every other page type: 0. */
  maxPerPage: 1,
  allowed: {
    tool: ["tool-below"],
    article: ["article"],
  } satisfies Record<PageType, Placement[]>,
  /** A page must carry at least this many words of publisher content before it may show ads. */
  minContentWords: 500,
  /** Paths (prefixes) that never show ads, even if a component asks. */
  blockedPathPrefixes: [
    "/privacy-policy",
    "/cookie-policy",
    "/terms",
    "/disclaimer",
    "/contact",
    "/about",
    "/faq",
    "/sitemap-page",
    "/404",
  ],
  /**
   * Tool states in which ads are hidden: empty tool ("idle"), processing, error and "ready to download" ("done").
   * An ad therefore only appears while files are queued. To also show it on an empty tool, remove "idle" (the page still has
   * 1,500+ words of publisher content, but this list follows the strict "never on empty states" rule).
   */
  hiddenWhenToolStatus: ["idle", "processing", "error", "done"],
} as const;

export function isPlacementAllowed(pageType: PageType, placement: Placement): boolean {
  return (adsConfig.allowed[pageType] as readonly Placement[]).includes(placement);
}

export function isPathBlocked(pathname: string): boolean {
  return adsConfig.blockedPathPrefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function adsReady(): boolean {
  return adsConfig.enabled && adsConfig.clientId !== "";
}

/** "pub-123" form used in ads.txt. */
export function publisherIdForAdsTxt(): string {
  return adsConfig.clientId.replace(/^ca-/, "");
}
