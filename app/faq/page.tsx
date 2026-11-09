import type { Metadata } from "next";
import Link from "next/link";
import { FaqSection } from "@/components/content/FaqSection";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { staticPageMeta } from "@/config/seo";
import { siteFaqs } from "@/content/faqs/site";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(staticPageMeta.faq!);

export default function FaqPage() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        mainEntity: siteFaqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
      breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "FAQ", path: "/faq/" }]),
    ],
  };
  return (
    <div className="mx-auto max-w-page px-4 py-8 sm:py-10">
      <JsonLd data={graph} />
      <div className="mx-auto max-w-prose">
        <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "FAQ", path: "/faq/" }]} />
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Frequently asked questions</h1>
        <p className="mt-3 text-lg leading-8 text-ink-soft">
          Quick answers about privacy, limits and troubleshooting. Each tool page also has its own FAQ, and the{" "}
          <Link className="font-medium text-brand-700 underline" href="/guides/">guides</Link> go deeper.
        </p>
        <div className="mt-8">
          <FaqSection faqs={siteFaqs} heading="General questions" />
        </div>
      </div>
    </div>
  );
}
