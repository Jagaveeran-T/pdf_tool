"use client";
import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { CONSENT_STORAGE_KEY, CONSENT_VERSION } from "@/lib/constants";
import { loadAnalytics } from "@/lib/analytics";
import { initSentry } from "@/lib/sentry";
import { CMP_MODE, type CmpMode } from "./cmpMode";

export interface ConsentChoices {
  analytics: boolean;
  ads: boolean;
}

export interface ConsentContextValue {
  mode: CmpMode;
  /** True once the stored choice has been read (avoids a banner flash for returning visitors). */
  ready: boolean;
  decided: boolean;
  choices: ConsentChoices;
  preferencesOpen: boolean;
  /** May the analytics (GA4) and diagnostics (Sentry) code load? */
  canLoadAnalytics: boolean;
  /** May the AdSense script load? */
  canLoadAds: boolean;
  save: (choices: ConsentChoices) => void;
  acceptAll: () => void;
  rejectAll: () => void;
  openPreferences: () => void;
  closePreferences: () => void;
}

export const ConsentContext = createContext<ConsentContextValue | null>(null);

type Gtag = (...args: unknown[]) => void;
const gtag = (): Gtag | undefined => (typeof window !== "undefined" ? (window as unknown as { gtag?: Gtag }).gtag : undefined);

function pushConsent(c: ConsentChoices) {
  // In "custom" mode we only ever offer NON-personalised ads, so ad_user_data and ad_personalization stay denied.
  gtag()?.("consent", "update", {
    analytics_storage: c.analytics ? "granted" : "denied",
    ad_storage: c.ads ? "granted" : "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

function readStored(): ConsentChoices | null {
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { v?: number; analytics?: boolean; ads?: boolean };
    if (parsed.v !== CONSENT_VERSION) return null;
    return { analytics: Boolean(parsed.analytics), ads: Boolean(parsed.ads) };
  } catch {
    return null;
  }
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const mode = CMP_MODE;
  const [ready, setReady] = useState(false);
  const [choices, setChoices] = useState<ConsentChoices>({ analytics: false, ads: false });
  const [decided, setDecided] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  useEffect(() => {
    const stored = mode === "custom" ? readStored() : null;
    if (stored) {
      setChoices(stored);
      setDecided(true);
      pushConsent(stored);
    }
    setReady(true);
  }, [mode]);

  const save = useCallback((c: ConsentChoices) => {
    setChoices(c);
    setDecided(true);
    setPreferencesOpen(false);
    pushConsent(c);
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({ v: CONSENT_VERSION, ...c, at: new Date().toISOString() }));
    } catch {
      /* storage blocked: the choice still applies for this visit */
    }
  }, []);

  // With a certified CMP (Google Funding Choices) the CMP owns consent signals; scripts may load and
  // Consent Mode (defaults: denied) plus the TCF string decide what Google actually does with them.
  const cmpOwned = mode === "google-fc";
  const canLoadAnalytics = cmpOwned ? true : choices.analytics;
  const canLoadAds = cmpOwned ? true : choices.ads;

  useEffect(() => {
    if (!canLoadAnalytics) return;
    if (siteConfig.gaId) loadAnalytics();
    if (siteConfig.sentryDsn) void initSentry();
  }, [canLoadAnalytics]);

  const value = useMemo<ConsentContextValue>(
    () => ({
      mode,
      ready,
      decided,
      choices,
      preferencesOpen,
      canLoadAnalytics,
      canLoadAds,
      save,
      acceptAll: () => save({ analytics: true, ads: true }),
      rejectAll: () => save({ analytics: false, ads: false }),
      openPreferences: () => {
        if (mode === "google-fc") {
          const fc = (window as unknown as { googlefc?: { showRevocationMessage?: () => void } }).googlefc;
          fc?.showRevocationMessage?.();
          return;
        }
        setPreferencesOpen(true);
      },
      closePreferences: () => setPreferencesOpen(false),
    }),
    [mode, ready, decided, choices, preferencesOpen, canLoadAnalytics, canLoadAds, save],
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}
