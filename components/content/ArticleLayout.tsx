import Link from "next/link";
import type { ReactNode } from "react";
import { AdSlot } from "@/components/ads/AdSlot";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl, siteConfig } from "@/config/site";
import { TOOL_LIST } from "@/config/tools";
import { postPath, type PostMeta } from "@/lib/mdx";
import { breadcrumbJsonLd } from "@/lib/seo";

const fmt = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

export function ArticleLayout({ post, related, children }: { post: PostMeta; related: PostMeta[]; children: ReactNode }) {
  const path = postPath(post.kind, post.slug);
  const sectionName = post.kind === "blog" ? "Blog" : "Guides";
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: post.updated,
        mainEntityOfPage: absoluteUrl(path),
        author: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
        publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
        image: absoluteUrl("/og/default.png"),
      },
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: sectionName, path: `/${post.kind}/` },
        { name: post.title, path },
      ]),
    ],
  };

  return (
    <div className="mx-auto max-w-page px-4 py-8 sm:py-10">
      <JsonLd data={jsonLd} />
      <div className="mx-auto max-w-prose">
        <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: sectionName, path: `/${post.kind}/` }, { name: post.title, path }]} />
        <header className="mb-8 space-y-3">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">{post.title}</h1>
          <p className="text-lg leading-8 text-ink-soft">{post.description}</p>
          <p className="text-sm text-ink-faint">
            Published {fmt(post.date)}
            {post.updated !== post.date ? ` · Updated ${fmt(post.updated)}` : ""} · {post.readingMinutes} min read
          </p>
        </header>
        <article className="prose-content">{children}</article>

        <AdSlot pageType="article" placement="article" contentWords={post.words} />

        <section aria-labelledby="try-tools" className="mt-12 space-y-3">
          <h2 id="try-tools" className="text-xl font-bold text-ink">Try the tools</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {TOOL_LIST.map((t) => (
              <li key={t.id}>
                <Link href={t.path} className="block rounded-xl border border-surface-line bg-white p-3 font-medium text-brand-700 hover:border-brand-200 hover:bg-brand-50">
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {related.length > 0 && (
          <section aria-labelledby="more-reading" className="mt-10 space-y-3">
            <h2 id="more-reading" className="text-xl font-bold text-ink">Keep reading</h2>
            <ul className="space-y-2">
              {related.map((r) => (
                <li key={`${r.kind}/${r.slug}`}>
                  <Link href={postPath(r.kind, r.slug)} className="font-medium text-brand-700 underline underline-offset-4">
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
