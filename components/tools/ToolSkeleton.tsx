/** Reserves roughly the height of the idle tool so nothing jumps when the real tool loads. */
export function ToolSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading tool">
      <div className="flex min-h-[260px] items-center justify-center rounded-2xl border-2 border-dashed border-brand-200 bg-white text-sm text-ink-soft">
        Loading tool…
      </div>
      <div className="min-h-[52px] rounded-lg bg-brand-50" />
    </div>
  );
}
