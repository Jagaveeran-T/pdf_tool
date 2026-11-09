"use client";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { formatBytes } from "@/lib/formatBytes";
import type { UploadedItem } from "@/hooks/useFileUpload";

interface Props {
  item: UploadedItem;
  index: number;
  total: number;
  disabled?: boolean;
  allowRotate?: boolean;
  onRemove: (id: string) => void;
  onRotate?: (id: string) => void;
  onMove: (from: number, to: number) => void;
}

const iconBtn =
  "inline-flex h-10 min-w-10 items-center justify-center rounded-lg border border-surface-line bg-white px-2 text-sm font-medium text-ink-soft hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-600";

export function FileCard({ item, index, total, disabled, allowRotate, onRemove, onRotate, onMove }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id, disabled });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const isPdf = item.kind === "pdf";

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`flex flex-col gap-3 rounded-xl border bg-white p-3 sm:flex-row sm:items-center ${
        isDragging ? "z-10 border-brand-600 shadow-lg" : "border-surface-line"
      } ${item.state === "error" ? "border-red-300 bg-red-50" : ""}`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          aria-label={`Drag ${item.file.name} to reorder`}
          disabled={disabled}
          className="hidden h-10 w-8 shrink-0 cursor-grab touch-none items-center justify-center rounded text-ink-faint hover:bg-surface-muted sm:inline-flex"
          {...attributes}
          {...listeners}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
            <circle cx="9" cy="6" r="1.5" /><circle cx="15" cy="6" r="1.5" /><circle cx="9" cy="12" r="1.5" />
            <circle cx="15" cy="12" r="1.5" /><circle cx="9" cy="18" r="1.5" /><circle cx="15" cy="18" r="1.5" />
          </svg>
        </button>
        <span className="w-6 shrink-0 text-center text-sm font-semibold text-ink-faint">{index + 1}</span>
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-surface-muted">
          {item.preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.preview}
              alt=""
              className="max-h-full max-w-full object-contain transition-transform"
              style={{ transform: `rotate(${item.rotation}deg)` }}
            />
          ) : (
            <span className="text-xs font-semibold text-ink-faint">{item.state === "checking" ? "…" : "PDF"}</span>
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-ink" title={item.file.name}>
            {item.file.name}
          </p>
          <p className="text-xs text-ink-soft">
            {formatBytes(item.file.size)}
            {isPdf && item.pages ? ` · ${item.pages} page${item.pages === 1 ? "" : "s"}` : ""}
            {item.rotation ? ` · rotated ${item.rotation}°` : ""}
            {item.state === "checking" ? " · reading…" : ""}
          </p>
          {item.error && <p className="mt-1 text-xs font-medium text-red-700">{item.error}</p>}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={iconBtn} disabled={disabled || index === 0} onClick={() => onMove(index, index - 1)} aria-label={`Move ${item.file.name} up`}>
          Move up
        </button>
        <button type="button" className={iconBtn} disabled={disabled || index === total - 1} onClick={() => onMove(index, index + 1)} aria-label={`Move ${item.file.name} down`}>
          Move down
        </button>
        {allowRotate && (
          <button type="button" className={iconBtn} disabled={disabled || item.state !== "ready"} onClick={() => onRotate?.(item.id)} aria-label={`Rotate ${item.file.name} 90 degrees clockwise`}>
            Rotate
          </button>
        )}
        <button type="button" className={`${iconBtn} text-red-700`} disabled={disabled} onClick={() => onRemove(item.id)} aria-label={`Remove ${item.file.name}`}>
          Remove
        </button>
      </div>
    </li>
  );
}
