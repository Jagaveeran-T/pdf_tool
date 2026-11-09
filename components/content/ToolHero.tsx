import type { ReactNode } from "react";
import { TrustBadges } from "./TrustBadges";

export function ToolHero({ title, intro, children }: { title: string; intro: string; children?: ReactNode }) {
  return (
    <header className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">{title}</h1>
      <p className="max-w-prose text-lg leading-8 text-ink-soft">{intro}</p>
      <TrustBadges />
      {children}
    </header>
  );
}
