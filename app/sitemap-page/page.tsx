import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { sitemapGroups } from "@/config/navigation";
import { staticPageMeta } from "@/config/seo";
import { getAllPosts, postPath } from "@/lib/mdx";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(staticPageMeta.sitemap!);

export default function SitemapPage() {
  const groups = sitemapGroups.map((g) => ({ title: g.title, links: g.links.map((l) => ({ label: l.label, href: l.href })) }));
  const extra = [
    { title: "Guides in full", links: getAllPosts("guides").map((p) => ({ label: p.title, href: postPath(p.kind, p.slug) })) },
    { title: "Blog posts in full", links: getAllPosts("blog").map((p) => ({ label: p.title, href: postPath(p.kind, p.slug) })) },
  ];
  return (
    <div className="mx-auto max-w-page px-4 py-8 sm:py-10">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Sitemap", path: "/sitemap-page/" }]} />
      <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Sitemap</h1>
      <p className="mt-3 max-w-prose text-lg leading-8 text-ink-soft">Every page on the site in one place.</p>
      <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {[...groups, ...extra].map((g) => (
          <section key={g.title} aria-labelledby={`sm-${g.title}`}>
            <h2 id={`sm-${g.title}`} className="text-lg font-semibold text-ink">{g.title}</h2>
            <ul className="mt-3 space-y-2">
              {g.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-brand-700 underline underline-offset-4">{l.label}</Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
