"use client";
import Script from "next/script";
import { adsConfig } from "@/config/ads";
import { CMP_MODE } from "./cmpMode";

/**
 * Loads Google Funding Choices when NEXT_PUBLIC_CMP_MODE=google-fc. The message itself (wording, TCF vendors,
 * regions) is configured in the AdSense dashboard under Privacy & messaging, not in code.
 */
export function CmpScript() {
  if (CMP_MODE !== "google-fc" || !adsConfig.clientId) return null;
  const pub = adsConfig.clientId.replace(/^ca-/, "");
  return (
    <>
      <Script id="fc-signal" strategy="afterInteractive">{`(function(){function signalGooglefcPresent(){if(!window.frames['googlefcPresent']){if(document.body){var i=document.createElement('iframe');i.style='width:0;height:0;border:none;z-index:-1000;left:-1000px;top:-1000px;';i.style.display='none';i.name='googlefcPresent';document.body.appendChild(i);}else{setTimeout(signalGooglefcPresent,0);}}}signalGooglefcPresent();})();`}</Script>
      <Script id="fc-script" src={`https://fundingchoicesmessages.google.com/i/${pub}?ers=1`} strategy="afterInteractive" />
    </>
  );
}
