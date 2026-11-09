interface Props {
  value: number;
  label?: string;
}

export function ProgressBar({ value, label }: Props) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm text-ink-soft">
        <span aria-live="polite">{label || "Working"}</span>
        <span>{pct}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label="Processing progress"
        className="h-2.5 w-full overflow-hidden rounded-full bg-brand-100"
      >
        <div className="h-full rounded-full bg-brand-600 transition-[width] duration-200" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
