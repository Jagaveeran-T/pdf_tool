import type { FaqItem } from "./types";

/** Visible FAQ. The matching FAQPage JSON-LD is emitted by the page (ToolSchema or the FAQ page). */
export function FaqSection({ faqs, heading = "Frequently asked questions" }: { faqs: FaqItem[]; heading?: string }) {
  return (
    <section aria-labelledby="faq" className="space-y-4">
      <h2 id="faq" className="text-2xl font-bold text-ink">{heading}</h2>
      <div className="divide-y divide-surface-line rounded-xl border border-surface-line bg-white">
        {faqs.map((f) => (
          <details key={f.q} className="group p-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink [&::-webkit-details-marker]:hidden">
              {f.q}
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-brand-600 transition group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </summary>
            <p className="mt-3 leading-7 text-ink-soft">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
