import type { Metadata } from "next";
import Link from "next/link";
import { learnLinks, toolLinks } from "@/config/navigation";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you were looking for does not exist. Use the links to find a PDF tool or article.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-page px-4 py-16">
      <div className="mx-auto max-w-prose text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-700">Error 404</p>
        <h1 className="mt-2 text-3xl font-bold text-ink sm:text-4xl">We could not find that page</h1>
        <p className="mt-3 text-lg text-ink-soft">The link may be old or mistyped. These pages might help.</p>
      </div>
      <div className="mx-auto mt-10 grid max-w-3xl gap-6 sm:grid-cols-2">
        <nav aria-label="Tools" className="rounded-2xl border border-surface-line bg-white p-5">
          <h2 className="font-semibold text-ink">PDF tools</h2>
          <ul className="mt-3 space-y-2">
            {toolLinks.map((l) => (
              <li key={l.href}><Link className="font-medium text-brand-700 underline underline-offset-4" href={l.href}>{l.label}</Link></li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Learn" className="rounded-2xl border border-surface-line bg-white p-5">
          <h2 className="font-semibold text-ink">Learn and get help</h2>
          <ul className="mt-3 space-y-2">
            {[{ label: "Home", href: "/" }, ...learnLinks, { label: "Contact", href: "/contact/" }, { label: "Sitemap", href: "/sitemap-page/" }].map((l) => (
              <li key={l.href}><Link className="font-medium text-brand-700 underline underline-offset-4" href={l.href}>{l.label}</Link></li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
