export function FeatureList({
  id,
  heading,
  items,
  variant = "cards",
}: {
  id: string;
  heading: string;
  items: { title?: string; text: string }[];
  variant?: "cards" | "plain";
}) {
  return (
    <section aria-labelledby={id} className="space-y-4">
      <h2 id={id} className="text-2xl font-bold text-ink">{heading}</h2>
      {variant === "cards" ? (
        <ul className="grid gap-3 sm:grid-cols-2">
          {items.map((it, i) => (
            <li key={i} className="rounded-xl border border-surface-line bg-white p-4">
              {it.title && <h3 className="font-semibold text-ink">{it.title}</h3>}
              <p className="mt-1 leading-7 text-ink-soft">{it.text}</p>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="list-disc space-y-2 pl-5 leading-7 text-ink-soft marker:text-brand-600">
          {items.map((it, i) => (
            <li key={i}>{it.text}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
