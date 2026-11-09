import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/content/LegalPage";
import { staticPageMeta } from "@/config/seo";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(staticPageMeta.about!);

export default function About() {
  return (
    <LegalPage
      title={`About ${siteConfig.name}`}
      path="/about/"
      updated={false}
      intro="Small, honest PDF tools that run in your browser, with plain-language guides beside them."
    >
      <h2>Why this site exists</h2>
      <p>
        Many online PDF services ask you to upload documents to a server you know nothing about, often alongside a signup form and a daily limit. Most everyday jobs, such as turning phone photos into one PDF, joining two files or pulling pages out of a long document, do not need any of that. Modern browsers can do the work on your own device. {siteConfig.name} is built around that idea.
      </p>

      <h2>What we offer</h2>
      <ul>
        <li><Link href="/image-to-pdf/">Image to PDF</Link> for JPG, PNG and WebP images, with page size, orientation and margin options.</li>
        <li><Link href="/jpg-to-pdf/">JPG to PDF</Link> for photos and scans, keeping upright JPEG data as it is.</li>
        <li><Link href="/merge-pdf/">Merge PDF</Link> to join files in the order you choose.</li>
        <li><Link href="/split-pdf/">Split PDF</Link> to extract pages or cut a PDF by range.</li>
        <li><Link href="/compress-pdf/">Compress PDF</Link> to shrink a PDF by recompressing its images, or by flattening pages when you need a size target.</li>
        <li>Written <Link href="/guides/">guides</Link> and a <Link href="/blog/">blog</Link> that explain the why behind each setting.</li>
      </ul>

      <h2>What we deliberately do not offer</h2>
      <p>Compression here is deliberately limited: it shrinks embedded images or flattens pages, and it cannot promise a size. There is no text recognition, password removal or editing. We would rather do five things well and describe their limits honestly than list features that do not work properly. When something is a limitation, such as encrypted files or very large documents on phones, we say so on the tool pages.</p>

      <h2>How the tools work</h2>
      <p>Your files are read and processed by code running in your browser. They are not uploaded to our servers. The result is created in memory and handed to you as a download. We explain the details, including the limits, in the <Link href="/blog/is-it-safe-to-use-online-pdf-tools/">article on whether online PDF tools are safe</Link> and in the <Link href="/privacy-policy/">Privacy Policy</Link>.</p>

      <h2>How the site is funded</h2>
      <p>The site is free. It is supported by advertising from Google AdSense, which is shown only on reading pages and never while a tool is working or a download is ready. Ads are labelled, kept away from buttons and subject to your cookie choices.</p>

      <h2>How we write</h2>
      <p>Every article is written to help someone finish a real task, and it names what the tools cannot do. We update pages when browsers or tools change. If you find a mistake, please tell us and we will fix it and note the date.</p>

      <h2>Get in touch</h2>
      <p>Write to <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> or use the <Link href="/contact/">contact page</Link>.</p>
    </LegalPage>
  );
}
