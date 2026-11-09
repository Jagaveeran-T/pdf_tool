import type { Metadata } from "next";
import Link from "next/link";
import { CMP_MODE } from "@/components/consent/cmpMode";
import { LegalPage } from "@/components/content/LegalPage";
import { adsConfig } from "@/config/ads";
import { staticPageMeta } from "@/config/seo";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(staticPageMeta.privacy!);

export default function PrivacyPolicy() {
  return (
    <LegalPage
      title="Privacy Policy"
      path="/privacy-policy/"
      intro={`This policy explains what ${siteConfig.name} does and does not do with information. The short version: your files stay on your device, and we only use cookies for analytics and advertising with your permission.`}
    >
      <h2>Who we are</h2>
      <p>
        {siteConfig.name} provides free PDF tools at {siteConfig.url}. You can reach the site operator, who is responsible for the information described here, at{" "}
        <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
      </p>

      <h2>Your files stay on your device</h2>
      <p>
        When you use Image to PDF, JPG to PDF, Merge PDF, Split PDF or Compress PDF, your browser reads the files you choose, processes them in your device memory and creates the result locally. The files and the resulting PDFs are not uploaded to our servers, and we cannot see them. This is backed by the way the site is built: it is a static website with no upload endpoint, and its security policy restricts which addresses the page may connect to. Closing or refreshing the tab discards the files from the page. Downloads you save are stored on your own device and are under your control.
      </p>
      <p>
        Image files can contain hidden details such as the date, location or device model in their EXIF data. The tools do not read this data except for the rotation flag, which is used only to turn a photo the right way up. Whatever remains in the image data of your files can end up in the PDF you create, so check it before you share it.
      </p>

      <h2>Information we handle</h2>
      <ul>
        <li><strong>Server logs.</strong> The site is hosted on Cloudflare Pages. Like any web host, Cloudflare processes technical data such as your IP address, browser type and the pages requested, to deliver the site and protect it from abuse. We do not use these logs to identify individual visitors.</li>
        <li><strong>Your cookie choice.</strong> If you use the built-in cookie banner, your choice is saved in your browser local storage so that we do not ask again. It is not sent to us.</li>
        <li><strong>Messages you send.</strong> If you email us or use the contact form, we receive your name, email address and message and use them only to reply. Form messages travel through the Web3Forms service to our inbox.</li>
      </ul>

      <h2>Analytics</h2>
      {siteConfig.gaId ? (
        <p>
          With your permission, we use Google Analytics 4 to count visits and tool usage, for example that Merge PDF was started or completed, how many files were used and a short error code if something failed. We never send file names or file contents. Google signals and ad personalisation signals are switched off for our analytics. If you decline, Google Analytics is not loaded.
        </p>
      ) : (
        <p>We do not currently use an analytics service. If we add one, it will load only with your permission, it will never receive file names or file contents, and this policy will be updated first.</p>
      )}
      {siteConfig.sentryDsn ? (
        <p>
          With the same permission we may use Sentry to receive error reports from the browser so we can fix bugs. Reports have request details, user details, breadcrumbs and extra data removed, and anything that looks like a file name is replaced before it is sent.
        </p>
      ) : (
        <p>We do not currently collect error reports from your browser.</p>
      )}

      <h2>Advertising and Google AdSense</h2>
      <p>
        This site is funded by advertising, which is served by Google AdSense where ads are enabled{adsConfig.enabled ? "" : " (ads may not be switched on yet)"}. Google and its partners may use cookies and similar technologies to deliver and measure ads, limit how often you see an ad, and prevent fraud. Ads are never shown while a tool is working or while you are downloading a result, and they are labelled Advertisement.
      </p>
      <p>
        Google, as a third-party vendor, uses cookies to serve ads on this site. {CMP_MODE === "google-fc"
          ? "In the European Economic Area, the United Kingdom and Switzerland, and wherever the law requires it, you will see a consent message provided by Google that lets you accept, reject or manage your choices before personalised advertising is used."
          : "Our cookie banner asks for your permission before the advertising script is loaded. Ads requested through this banner are non-personalised, which means they are not based on your past browsing or profile."}{" "}
        You can reopen your choices at any time with the Manage cookies link in the footer.
      </p>
      <p>You can learn how Google uses information from sites that use its services, and control personalised advertising, here:</p>
      <ul>
        <li><a href="https://policies.google.com/technologies/partner-sites">How Google uses information from sites or apps that use our services</a></li>
        <li><a href="https://adssettings.google.com">Google Ads Settings</a>, where you can opt out of personalised advertising</li>
        <li><a href="https://www.aboutads.info/choices/">aboutads.info</a> and <a href="https://www.youronlinechoices.eu/">youronlinechoices.eu</a>, where you can opt out of personalised advertising from other participating vendors</li>
      </ul>
      <p>Opting out of personalised ads does not remove ads altogether. It means the ads shown are less relevant to you. Read the <Link href="/cookie-policy/">Cookie Policy</Link> for the list of storage we use.</p>

      <h2>Legal bases</h2>
      <p>Where data protection laws such as the GDPR or the UK GDPR apply, we rely on your consent for analytics and advertising cookies, and on our legitimate interest in running a secure, working website for the technical data that hosting requires. You may withdraw consent at any time, which does not affect earlier processing.</p>

      <h2>Sharing and international transfers</h2>
      <p>We do not sell your personal information. Data may be handled by our service providers: Cloudflare for hosting, Google for advertising{siteConfig.gaId ? " and analytics" : ""}{siteConfig.sentryDsn ? ", Sentry for error reports" : ""} and Web3Forms for contact messages. Some of these providers process data outside your country, and they apply their own safeguards and terms.</p>

      <h2>Retention</h2>
      <p>Emails and contact messages are kept for as long as needed to answer you and keep a record of the conversation, then deleted. We hold no copies of your files at all. Retention of data held by Google, Cloudflare and other providers follows their policies.</p>

      <h2>Your rights</h2>
      <p>Depending on where you live, you may have the right to access, correct or delete personal information, to object to or restrict its use, to receive a copy of it and to complain to your local data protection authority. Because we hold very little personal information, the most common requests are about messages you sent us. Email us and we will respond.</p>

      <h2>Children</h2>
      <p>The site is a general-purpose utility and is not directed to children under 13, or under the age set by local law. We do not knowingly collect personal information from children. If you believe a child has sent us personal information, contact us and we will delete it.</p>

      <h2>Security</h2>
      <p>The site is served over HTTPS and sends security headers to browsers. No method of transmission or storage is perfectly secure, so we cannot promise absolute security, and you should keep your own copies of important documents.</p>

      <h2>Changes to this policy</h2>
      <p>If we change what we collect, or add a new service, we will update this page and the date at the top before the change takes effect.</p>

      <h2>Contact</h2>
      <p>Questions about privacy? Write to <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.</p>
    </LegalPage>
  );
}
