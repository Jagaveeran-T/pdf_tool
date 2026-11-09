import type { Metadata } from "next";
import { ContactForm } from "@/components/common/ContactForm";
import { LegalPage } from "@/components/content/LegalPage";
import { staticPageMeta } from "@/config/seo";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(staticPageMeta.contact!);

export default function ContactPage() {
  return (
    <LegalPage
      title="Contact us"
      path="/contact/"
      updated={false}
      intro="Questions, bug reports, corrections and feedback are all welcome. We read every message."
    >
      <h2>Email</h2>
      <p>
        You can write to us at <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>. We aim to reply within a few working days, though that is a goal rather than a guarantee.
      </p>
      <h2>What helps us help you</h2>
      <ul>
        <li>Which tool you used and what you expected to happen.</li>
        <li>Your browser and device, for example Chrome on Android or Safari on iPhone.</li>
        <li>The error message, if one appeared.</li>
      </ul>
      <p>Please do not send the document itself. The tools run in your browser, so we never need your files to investigate a problem, and we would rather not receive them.</p>
      <h2>Send a message</h2>
      <ContactForm />
    </LegalPage>
  );
}
