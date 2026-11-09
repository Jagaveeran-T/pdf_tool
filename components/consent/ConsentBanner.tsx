"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useConsent } from "@/hooks/useConsent";

export function ConsentBanner() {
  const c = useConsent();
  const [custom, setCustom] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [ads, setAds] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const visible = c.mode === "custom" && c.ready && (!c.decided || c.preferencesOpen);
  const showDetails = custom || c.preferencesOpen;

  useEffect(() => {
    if (c.preferencesOpen) {
      setAnalytics(c.choices.analytics);
      setAds(c.choices.ads);
    }
  }, [c.preferencesOpen, c.choices]);

  useEffect(() => {
    if (visible && c.preferencesOpen) panelRef.current?.focus();
  }, [visible, c.preferencesOpen]);

  if (!visible) return null;

  return (
    <div
      ref={panelRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="false"
      aria-labelledby="consent-title"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-surface-line bg-white p-4 shadow-[0_-8px_30px_rgba(15,23,42,0.12)] sm:inset-x-auto sm:bottom-4 sm:right-4 sm:max-w-md sm:rounded-2xl sm:border"
    >
      <h2 id="consent-title" className="text-base font-bold text-ink">Your privacy choices</h2>
      <p className="mt-1 text-sm leading-6 text-ink-soft">
        The PDF tools work without any cookies, and your files never leave your device. With your permission we also use cookies for
        anonymous usage statistics and for advertising (non-personalised ads). Read the{" "}
        <Link href="/cookie-policy/" className="font-medium text-brand-700 underline">Cookie Policy</Link> and{" "}
        <Link href="/privacy-policy/" className="font-medium text-brand-700 underline">Privacy Policy</Link>.
      </p>

      {showDetails && (
        <div className="mt-3 space-y-2">
          <div className="rounded-lg bg-surface-muted p-3 text-sm text-ink-soft">
            <strong className="text-ink">Strictly necessary:</strong> remembering this choice. Always on.
          </div>
          <label className="flex items-start gap-3 rounded-lg bg-surface-muted p-3 text-sm">
            <input type="checkbox" className="mt-1 h-5 w-5 accent-brand-600" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} />
            <span><strong className="text-ink">Analytics and diagnostics.</strong> Anonymous page and tool-usage counts and error reports. Never file names or contents.</span>
          </label>
          <label className="flex items-start gap-3 rounded-lg bg-surface-muted p-3 text-sm">
            <input type="checkbox" className="mt-1 h-5 w-5 accent-brand-600" checked={ads} onChange={(e) => setAds(e.target.checked)} />
            <span><strong className="text-ink">Advertising.</strong> Allows Google AdSense to show non-personalised ads and use cookies for ad delivery and fraud prevention.</span>
          </label>
        </div>
      )}

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button type="button" className="btn btn-primary !py-2 sm:flex-1" onClick={c.acceptAll}>Accept all</button>
        <button type="button" className="btn btn-secondary !py-2 sm:flex-1" onClick={c.rejectAll}>Reject all</button>
        {showDetails ? (
          <button type="button" className="btn btn-secondary !py-2 sm:flex-1" onClick={() => c.save({ analytics, ads })}>Save choices</button>
        ) : (
          <button type="button" className="btn btn-secondary !py-2 sm:flex-1" onClick={() => setCustom(true)}>Customise</button>
        )}
      </div>
      {c.preferencesOpen && c.decided && (
        <button type="button" className="mt-2 text-sm text-ink-soft underline" onClick={c.closePreferences}>Close without changes</button>
      )}
    </div>
  );
}
