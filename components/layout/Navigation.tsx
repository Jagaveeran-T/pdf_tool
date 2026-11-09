"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { headerMore, headerPrimary } from "@/config/navigation";

export function Navigation() {
  const pathname = usePathname();
  const link = (href: string) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-brand-50 hover:text-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-600 ${
      pathname === href ? "bg-brand-50 text-brand-700" : "text-ink-soft"
    }`;
  return (
    <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
      {headerPrimary.map((l) => (
        <Link key={l.href} href={l.href} className={link(l.href)} aria-current={pathname === l.href ? "page" : undefined}>
          {l.label}
        </Link>
      ))}
      <details className="group relative">
        <summary className="flex cursor-pointer list-none items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-ink-soft hover:bg-brand-50 hover:text-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-600 [&::-webkit-details-marker]:hidden">
          More
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 transition group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </summary>
        <ul className="absolute right-0 z-30 mt-2 w-56 rounded-xl border border-surface-line bg-white p-2 shadow-lg">
          {headerMore.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="block rounded-lg px-3 py-2 text-sm text-ink-soft hover:bg-brand-50 hover:text-brand-700">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </details>
    </nav>
  );
}
