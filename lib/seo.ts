import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "@/config/site";
import { defaultMeta } from "@/config/seo";

export interface BuildMetaInput {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
}

/** Single builder for per-page metadata: unique title and description, canonical URL, Open Graph, Twitter. */
export function buildMetadata(input: BuildMetaInput): Metadata {
  const canonical = absoluteUrl(input.path);
  const image = absoluteUrl(input.image ?? defaultMeta.ogImage);
  return {
    title: input.title,
    description: input.description,
    alternates: { canonical },
    robots: input.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      title: input.title,
      description: input.description,
      url: canonical,
      siteName: siteConfig.name,
      type: input.type ?? "website",
      locale: "en_US",
      images: [{ url: image, width: 1200, height: 630, alt: input.title }],
      ...(input.type === "article"
        ? { publishedTime: input.publishedTime, modifiedTime: input.modifiedTime ?? input.publishedTime }
        : {}),
    },
    twitter: { card: "summary_large_image", title: input.title, description: input.description, images: [image] },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
