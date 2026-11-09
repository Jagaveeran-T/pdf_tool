import type { ReactNode } from "react";
import { AdSlot } from "@/components/ads/AdSlot";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ToolSchema } from "@/components/seo/ToolSchema";
import { TOOLS, type ToolId } from "@/config/tools";
import { countWords } from "@/lib/wordCount";
import { FaqSection } from "./FaqSection";
import { FeatureList } from "./FeatureList";
import { HowItWorks } from "./HowItWorks";
import { RelatedTools } from "./RelatedTools";
import { ToolHero } from "./ToolHero";
import type { FaqItem, ToolContent } from "./types";

export function toolContentWords(c: ToolContent): number {
  const parts = [
    c.intro,
    ...c.sections.flatMap((s) => [s.heading, ...s.paragraphs, ...(s.bullets ?? [])]),
    c.howTo.name,
    c.howTo.description,
    ...c.howTo.steps.flatMap((s) => [s.title, s.text]),
    ...c.tips.flatMap((t) => [t.title, t.text]),
    ...c.limitations,
  ];
  return countWords(parts.join("\n"));
}

interface Props {
  toolId: ToolId;
  title: string;
  content: ToolContent;
  faqs: FaqItem[];
  children: ReactNode;
}

export function ToolPageLayout({ toolId, title, content, faqs, children }: Props) {
  const tool = TOOLS[toolId];
  const words = toolContentWords(content);
  const [first, second, ...rest] = content.sections;

  const renderSection = (s: ToolContent["sections"][number]) => (
    <section key={s.id} aria-labelledby={s.id} className="space-y-3">
      <h2 id={s.id} className="text-2xl font-bold text-ink">{s.heading}</h2>
      {s.paragraphs.map((p, i) => (
        <p key={i} className="leading-8 text-ink-soft">{p}</p>
      ))}
      {s.bullets && (
        <ul className="list-disc space-y-1 pl-5 leading-7 text-ink-soft marker:text-brand-600">
          {s.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      )}
    </section>
  );

  return (
    <div className="mx-auto max-w-page px-4 py-8 sm:py-10">
      <ToolSchema tool={tool} content={content} faqs={faqs} />
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: tool.name, path: tool.path }]} />
      <ToolHero title={title} intro={content.intro} />
      <section aria-label={`${tool.name} tool`} className="mt-8 rounded-2xl border border-surface-line bg-surface p-4 shadow-sm sm:p-6">
        {children}
      </section>

      {/* Publisher content. The ad sits after ~2 sections, far from the upload area and every action button. */}
      <article className="mx-auto mt-14 max-w-prose space-y-12">
        {first && renderSection(first)}
        {second && renderSection(second)}
        <AdSlot pageType="tool" placement="tool-below" contentWords={words} />
        {rest.map(renderSection)}
        <HowItWorks name={content.howTo.name} steps={content.howTo.steps} />
        <FeatureList id="tips" heading="Tips for better results" items={content.tips} />
        <FeatureList id="limits" heading="Limits and things to know" variant="plain" items={content.limitations.map((text) => ({ text }))} />
        <FaqSection faqs={faqs} />
        <RelatedTools ids={tool.related} />
        <p className="text-ink-soft">
          Want the longer explanation? Read our <a className="font-medium text-brand-700 underline" href={tool.guide}>step-by-step guide</a>.
        </p>
      </article>
    </div>
  );
}
