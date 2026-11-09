export function PrivacyNotice() {
  return (
    <p className="flex items-start gap-2 rounded-lg bg-brand-50 p-3 text-sm text-ink-soft">
      <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="5" y="11" width="14" height="9" rx="2" />
        <path d="M8 11V8a4 4 0 018 0v3" />
      </svg>
      <span>
        Your files are processed in this browser tab and are not uploaded to our servers. Closing or refreshing the page discards
        them.
      </span>
    </p>
  );
}
