import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { siteConfig } from "@/config/site";

/** Shared shell for About, policy and similar pages. These pages never carry ads. */
export function LegalPage({ title, path, intro, updated = true, children }: { title: string; path: string; intro?: string; updated?: boolean; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-page px-4 py-8 sm:py-10">
      <div className="mx-auto max-w-prose">
        <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: title, path }]} />
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">{title}</h1>
        {intro && <p className="mt-3 text-lg leading-8 text-ink-soft">{intro}</p>}
        {updated && <p className="mt-2 text-sm text-ink-faint">Last updated {siteConfig.lastUpdated}</p>}
        <div className="prose-content mt-8">{children}</div>
      </div>
    </div>
  );
}
