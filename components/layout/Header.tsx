import Link from "next/link";
import { siteConfig } from "@/config/site";
import { MobileMenu } from "./MobileMenu";
import { Navigation } from "./Navigation";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-surface-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-page items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-600" aria-label={`${siteConfig.name} home`}>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M7 3h7l5 5v12a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1zm6 1.5V9h4.5L13 4.5z" />
            </svg>
          </span>
          <span className="text-lg font-bold tracking-tight text-ink">{siteConfig.name}</span>
        </Link>
        <Navigation />
        <MobileMenu />
      </div>
    </header>
  );
}
