"use client";
import { useConsent } from "@/hooks/useConsent";

/** Footer link that reopens the consent preferences (built-in banner or Google Funding Choices). */
export function ManageCookiesLink() {
  const { openPreferences } = useConsent();
  return (
    <button type="button" onClick={openPreferences} className="text-left text-sm text-ink-soft hover:text-brand-700 hover:underline">
      Manage cookies
    </button>
  );
}
