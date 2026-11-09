import type { Metadata } from "next";
import { CMP_MODE } from "@/components/consent/cmpMode";
import { LegalPage } from "@/components/content/LegalPage";
import { staticPageMeta } from "@/config/seo";
import { siteConfig } from "@/config/site";
import { ManageCookiesLink } from "@/components/consent/ManageCookiesLink";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(staticPageMeta.cookies!);

export default function CookiePolicy() {
  return (
    <LegalPage
      title="Cookie Policy"
      path="/cookie-policy/"
      intro="Cookies are small pieces of data a website stores in your browser. This page lists what this site stores, why, and how to change your mind."
    >
      <h2>Strictly necessary storage</h2>
      <p>
        The PDF tools themselves do not need cookies. The only item we set ourselves is a small record of your cookie choice, named consent.v1, kept in your browser local storage. It exists so that we do not ask you again on every visit, and it is not sent to any server.
      </p>

      <h2>Analytics (only with your permission)</h2>
      {siteConfig.gaId ? (
        <p>
          If you allow analytics, Google Analytics 4 may set first-party cookies such as _ga and _ga_ followed by an identifier. They help us count visits and see which tools are used. We send only the tool name, the number of files and a short error code, never file names or contents. If you decline, none of these are set.
        </p>
      ) : (
        <p>No analytics cookies are set at the moment. If we add analytics later, it will load only with your permission and this page will be updated.</p>
      )}

      <h2>Advertising (only with your permission, where ads are enabled)</h2>
      <p>
        Google AdSense and its partners may store or read cookies and use similar technologies in your browser to deliver ads, limit how often you see them, measure them and detect fraud. The names, lifetimes and purposes of those cookies are set by Google and may change, so they are described in{" "}
        <a href="https://policies.google.com/technologies/cookies">Google documentation on cookies</a> rather than listed here. {CMP_MODE === "google-fc"
          ? "Your choices are collected through a consent message provided by Google, and you can reopen it from the footer."
          : "With our banner, ads are requested as non-personalised, and the advertising script is not loaded until you allow it."}
      </p>

      <h2>How to change your choice</h2>
      <p>
        Use the Manage cookies control below, or the same link in the page footer, to open the preferences again. You can also delete cookies and site data in your browser settings, and most browsers can block third-party cookies. Blocking cookies does not stop the PDF tools from working.
      </p>
      <p><ManageCookiesLink /></p>

      <h2>Personalised advertising</h2>
      <p>
        To opt out of personalised ads from Google, visit <a href="https://adssettings.google.com">Google Ads Settings</a>. To opt out of personalised ads from many other companies, visit <a href="https://www.aboutads.info/choices/">aboutads.info</a> or <a href="https://www.youronlinechoices.eu/">youronlinechoices.eu</a>.
      </p>

      <h2>More information</h2>
      <p>See the Privacy Policy for the full picture, or write to <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> with questions.</p>
    </LegalPage>
  );
}
