interface Props {
  messages: string[];
  onDismiss?: () => void;
  tone?: "error" | "warning";
}

export function ErrorMessage({ messages, onDismiss, tone = "error" }: Props) {
  if (messages.length === 0) return null;
  const styles =
    tone === "error"
      ? "border-red-200 bg-red-50 text-red-900"
      : "border-amber-200 bg-amber-50 text-amber-900";
  return (
    <div role="alert" className={`rounded-lg border p-3 text-sm ${styles}`}>
      <div className="flex items-start justify-between gap-3">
        <ul className="space-y-1">
          {messages.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
        {onDismiss && (
          <button type="button" onClick={onDismiss} className="shrink-0 rounded px-2 py-1 text-xs font-semibold underline">
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
}
