"use client";
import Script from "next/script";
import { adsConfig, adsReady } from "@/config/ads";
import { useConsent } from "@/hooks/useConsent";

/** Loads adsbygoogle.js only when ads are enabled, a valid publisher ID exists AND consent allows it. */
export function AdSenseScript() {
  const { canLoadAds, mode } = useConsent();
  if (!adsReady() || !canLoadAds) return null;
  return (
    <>
      {mode === "custom" && (
        // The built-in banner is not a Google-certified CMP, so only non-personalised ads are requested.
        <Script id="adsense-npa" strategy="afterInteractive">{`window.adsbygoogle=window.adsbygoogle||[];window.adsbygoogle.requestNonPersonalizedAds=1;`}</Script>
      )}
      <Script
        id="adsense-js"
        async
        strategy="afterInteractive"
        crossOrigin="anonymous"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsConfig.clientId}`}
      />
    </>
  );
}
