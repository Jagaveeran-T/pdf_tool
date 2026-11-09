import type { FaqItem, ToolContent } from "@/components/content/types";
import type { ToolMeta } from "@/config/tools";
import { absoluteUrl, siteConfig } from "@/config/site";
import { breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "./JsonLd";

export function ToolSchema({ tool, content, faqs }: { tool: ToolMeta; content: ToolContent; faqs: FaqItem[] }) {
  const url = absoluteUrl(tool.path);
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: tool.name,
        url,
        description: tool.seoDescription,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any (modern web browser)",
        browserRequirements: "Requires JavaScript and a current browser",
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
      },
      {
        "@type": "HowTo",
        name: content.howTo.name,
        description: content.howTo.description,
        totalTime: content.howTo.totalTime,
        step: content.howTo.steps.map((s, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: s.title,
          text: s.text,
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: tool.name, path: tool.path },
      ]),
    ],
  };
  return <JsonLd data={graph} />;
}
