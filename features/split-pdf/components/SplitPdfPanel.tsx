"use client";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { FileUploader } from "@/components/common/FileUploader";
import { PrivacyNotice } from "@/components/common/PrivacyNotice";
import { ProgressBar } from "@/components/common/ProgressBar";
import { ResultPanel } from "@/components/common/ResultPanel";
import { formatBytes } from "@/lib/formatBytes";
import { presetValue, splitConfig } from "../config";
import { useSplitPdf } from "../hooks/useSplitPdf";

const PRESETS = [
  { id: "first", label: "First page" },
  { id: "last", label: "Last page" },
  { id: "odd", label: "Odd pages" },
  { id: "even", label: "Even pages" },
] as const;

export default function SplitPdfPanel() {
  const s = useSplitPdf();
  const busy = s.processing.status === "processing";
  const done = s.processing.status === "done";
  const pages = s.item?.pages;

  return (
    <div className="space-y-4">
      {!done && !s.item && (
        <FileUploader
          accept={splitConfig.inputAccept}
          label={splitConfig.uploadLabel}
          hint={splitConfig.uploadHint}
          multiple={false}
          disabled={busy}
          onFiles={s.choose}
        />
      )}
      <ErrorMessage messages={s.upload.messages} onDismiss={s.upload.dismissMessages} />

      {s.item && !done && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl border border-surface-line bg-white p-3">
            <div className="flex h-20 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-surface-muted">
              {s.item.preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.item.preview} alt="First page preview" className="max-h-full max-w-full object-contain" />
              ) : (
                <span className="text-xs font-semibold text-ink-faint">PDF</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink" title={s.item.file.name}>{s.item.file.name}</p>
              <p className="text-xs text-ink-soft">
                {formatBytes(s.item.file.size)}
                {pages ? ` · ${pages} page${pages === 1 ? "" : "s"}` : s.item.state === "checking" ? " · reading…" : ""}
              </p>
              {s.item.error && <p className="mt-1 text-xs font-medium text-red-700">{s.item.error}</p>}
            </div>
            <button type="button" className="btn btn-secondary" onClick={s.startOver} disabled={busy}>
              Change file
            </button>
          </div>

          <fieldset className="space-y-2" disabled={busy}>
            <legend className="mb-1 text-sm font-semibold text-ink">What do you want to do?</legend>
            {splitConfig.modes.map((m) => (
              <label key={m.value} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 ${s.mode === m.value ? "border-brand-600 bg-brand-50" : "border-surface-line bg-white"}`}>
                <input type="radio" name="split-mode" className="mt-1 h-4 w-4 accent-brand-600" checked={s.mode === m.value} onChange={() => s.setMode(m.value)} />
                <span>
                  <span className="block text-sm font-semibold text-ink">{m.label}</span>
                  <span className="block text-sm text-ink-soft">{m.help}</span>
                </span>
              </label>
            ))}
          </fieldset>

          {s.mode !== "each-page" && (
            <div className="space-y-2">
              <label htmlFor="page-ranges" className="block text-sm font-semibold text-ink">
                Pages
              </label>
              <input
                id="page-ranges"
                className="input"
                inputMode="text"
                autoComplete="off"
                placeholder="For example 1-3, 5, 8-10"
                value={s.ranges}
                disabled={busy}
                onChange={(e) => s.setRanges(e.target.value)}
                aria-describedby="range-help"
                aria-invalid={Boolean(s.ranges && s.problem)}
              />
              <p id="range-help" className="text-sm text-ink-soft">Pages are counted from 1. Use commas between entries.</p>
              {pages ? (
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map((p) => (
                    <button key={p.id} type="button" className="btn btn-secondary !min-h-10 !px-3 !py-1.5 text-sm" disabled={busy} onClick={() => s.setRanges(presetValue(p.id, pages))}>
                      {p.label}
                    </button>
                  ))}
                </div>
              ) : null}
              {s.ranges && s.problem && <p className="text-sm font-medium text-red-700">{s.problem}</p>}
            </div>
          )}
          {s.mode === "each-page" && s.problem && <ErrorMessage messages={[s.problem]} />}
        </div>
      )}

      {busy && (
        <div className="space-y-3">
          <ProgressBar value={s.processing.progress} label={s.processing.label} />
          <button type="button" className="btn btn-secondary" onClick={s.processing.cancel}>Cancel</button>
        </div>
      )}
      {s.processing.status === "error" && s.processing.error && <ErrorMessage messages={[s.processing.error]} />}
      {done && s.processing.result && <ResultPanel result={s.processing.result} onReset={s.startOver} resetLabel="Split another PDF" />}

      {s.item && !done && !busy && (
        <button type="button" className="btn btn-primary" onClick={s.split} disabled={!s.canSplit}>
          {s.mode === "extract" ? "Extract pages" : "Split PDF"}
        </button>
      )}
      <PrivacyNotice />
    </div>
  );
}
