import type { HowToStep } from "./types";

export function HowItWorks({ name, steps }: { name: string; steps: HowToStep[] }) {
  return (
    <section aria-labelledby="how-it-works" className="space-y-4">
      <h2 id="how-it-works" className="text-2xl font-bold text-ink">{name}</h2>
      <ol className="space-y-3">
        {steps.map((s, i) => (
          <li key={s.title} className="flex gap-4 rounded-xl border border-surface-line bg-white p-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white" aria-hidden="true">
              {i + 1}
            </span>
            <div>
              <h3 className="font-semibold text-ink">{s.title}</h3>
              <p className="mt-1 leading-7 text-ink-soft">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
