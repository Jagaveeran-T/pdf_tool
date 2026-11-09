import Link from "next/link";
import { footerGroups } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { ManageCookiesLink } from "@/components/consent/ManageCookiesLink";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-surface-line bg-white">
      <div className="mx-auto max-w-page px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <p className="text-lg font-bold text-ink">{siteConfig.name}</p>
            <p className="mt-2 text-sm leading-6 text-ink-soft">{siteConfig.tagline}. Your files are processed in your browser and are not uploaded to our servers.</p>
          </div>
          {footerGroups.map((g) => (
            <nav key={g.title} aria-label={g.title}>
              <p className="text-sm font-semibold text-ink">{g.title}</p>
              <ul className="mt-3 space-y-2">
                {g.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-ink-soft hover:text-brand-700 hover:underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
                {g.title === "Legal" && (
                  <li>
                    <ManageCookiesLink />
                  </li>
                )}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-8 flex flex-col gap-2 border-t border-surface-line pt-6 text-sm text-ink-faint sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p>
            Contact: <a className="underline hover:text-brand-700" href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
