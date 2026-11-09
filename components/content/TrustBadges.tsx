const BADGES = ["Processed locally in your browser", "No signup", "Free to use"];

export function TrustBadges() {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Key facts">
      {BADGES.map((b) => (
        <li key={b} className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-sm font-medium text-brand-800">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 13l4 4L19 7" />
          </svg>
          {b}
        </li>
      ))}
    </ul>
  );
}
