import type { Metadata } from "next";
import Link from "next/link";
import { TrustBadges } from "@/components/content/TrustBadges";
import { ToolCard } from "@/components/common/ToolCard";
import { FaqSection } from "@/components/content/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { staticPageMeta } from "@/config/seo";
import { absoluteUrl, siteConfig } from "@/config/site";
import { TOOL_LIST } from "@/config/tools";
import { siteFaqs } from "@/content/faqs/site";
import { getAllPosts, postPath } from "@/lib/mdx";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...buildMetadata(staticPageMeta.home!),
  title: { absolute: staticPageMeta.home!.title },
};

const STEPS = [
  { title: "Choose your files", text: "Pick images or PDFs from your device, or drag them onto the page. The tool checks each file and tells you at once if something is wrong." },
  { title: "Set it up", text: "Put the files in order and choose the options that matter, such as page size for images or the page range to extract from a PDF." },
  { title: "Download the result", text: "The new PDF, or a ZIP when several files are created, is built on your device. Save it, open it and check it before you send it." },
];

export default function HomePage() {
  const guides = getAllPosts("guides").slice(0, 3);
  const blog = getAllPosts("blog").slice(0, 3);
  const site = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.tagline,
    publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url, logo: absoluteUrl("/icon-512.png") },
  };

  return (
    <>
      <JsonLd data={site} />
      <section className="border-b border-surface-line bg-gradient-to-b from-brand-50 to-surface-muted">
        <div className="mx-auto max-w-page px-4 py-12 sm:py-16">
          <div className="max-w-3xl space-y-5">
            <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl">Free PDF tools that run in your browser</h1>
            <p className="text-lg leading-8 text-ink-soft sm:text-xl">
              Turn images into a PDF, merge PDF files and split a PDF into pages. Your files are processed on your own device and are not uploaded to our servers, and there is nothing to sign up for.
            </p>
            <TrustBadges />
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Link href="/image-to-pdf/" className="btn btn-primary">Convert images to PDF</Link>
              <Link href="/merge-pdf/" className="btn btn-secondary">Merge PDF files</Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-page space-y-16 px-4 py-12">
        <section aria-labelledby="tools">
          <h2 id="tools" className="text-2xl font-bold text-ink sm:text-3xl">Choose a tool</h2>
          <p className="mt-2 max-w-prose text-ink-soft">Five focused tools, each with a plain explanation of what it does and where its limits are.</p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TOOL_LIST.map((t) => (
              <li key={t.id}><ToolCard tool={t} /></li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="how">
          <h2 id="how" className="text-2xl font-bold text-ink sm:text-3xl">How it works</h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title} className="rounded-2xl border border-surface-line bg-white p-5 shadow-sm">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 font-bold text-white">{i + 1}</span>
                <h3 className="mt-3 text-lg font-semibold text-ink">{s.title}</h3>
                <p className="mt-1 leading-7 text-ink-soft">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="trust" className="rounded-2xl border border-brand-200 bg-white p-6 sm:p-8">
          <h2 id="trust" className="text-2xl font-bold text-ink">Why local processing matters</h2>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            <p className="leading-7 text-ink-soft">
              Documents are often private: an identity card, a signed form, a medical letter. When a tool runs in your browser, that file never has to travel to a server to be turned into a PDF. You also avoid upload waits and daily limits, and the tools keep working after the page has loaded even if your connection is slow.
            </p>
            <p className="leading-7 text-ink-soft">
              We are straightforward about trade-offs. Everything depends on your device memory, so very large files can fail on a phone. Compression is limited (it shrinks images or flattens pages, and cannot guarantee a size), and there is no text recognition or password removal. Read{" "}
              <Link className="font-medium text-brand-700 underline" href="/blog/is-it-safe-to-use-online-pdf-tools/">is it safe to use online PDF tools?</Link> for a clear-eyed look at what to check on any site.
            </p>
          </div>
        </section>

        <section aria-labelledby="learn" className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 id="learn" className="text-2xl font-bold text-ink">Guides</h2>
            <ul className="mt-4 space-y-3">
              {guides.map((p) => (
                <li key={p.slug}>
                  <Link href={postPath(p.kind, p.slug)} className="font-medium text-brand-700 underline underline-offset-4">{p.title}</Link>
                  <p className="text-sm text-ink-soft">{p.description}</p>
                </li>
              ))}
            </ul>
            <p className="mt-4"><Link href="/guides/" className="font-semibold text-brand-700">All guides →</Link></p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-ink">From the blog</h2>
            <ul className="mt-4 space-y-3">
              {blog.map((p) => (
                <li key={p.slug}>
                  <Link href={postPath(p.kind, p.slug)} className="font-medium text-brand-700 underline underline-offset-4">{p.title}</Link>
                  <p className="text-sm text-ink-soft">{p.description}</p>
                </li>
              ))}
            </ul>
            <p className="mt-4"><Link href="/blog/" className="font-semibold text-brand-700">All articles →</Link></p>
          </div>
        </section>

        <div className="mx-auto max-w-prose">
          <FaqSection faqs={siteFaqs.slice(0, 6)} />
          <p className="mt-4 text-ink-soft">More answers are on the <Link className="font-medium text-brand-700 underline" href="/faq/">FAQ page</Link>.</p>
        </div>
      </div>
    </>
  );
}
