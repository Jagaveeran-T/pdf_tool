"use client";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { FileUploader } from "@/components/common/FileUploader";
import { PrivacyNotice } from "@/components/common/PrivacyNotice";
import { ProgressBar } from "@/components/common/ProgressBar";
import { ResultPanel } from "@/components/common/ResultPanel";
import { formatBytes } from "@/lib/formatBytes";
import { compressConfig } from "../config";
import { useCompressPdf } from "../hooks/useCompressPdf";
import type { TargetKb } from "../types";

export default function CompressPdfPanel() {
  const c = useCompressPdf();
  const busy = c.processing.status === "processing";
  const done = c.processing.status === "done";
  const pages = c.item?.pages;

  return (
    <div className="space-y-4">
      {!done && !c.item && (
        <FileUploader
          accept={compressConfig.inputAccept}
          label={compressConfig.uploadLabel}
          hint={compressConfig.uploadHint}
          multiple={false}
          disabled={busy}
          onFiles={c.choose}
        />
      )}
      <ErrorMessage messages={c.upload.messages} onDismiss={c.upload.dismissMessages} />

      {c.item && !done && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl border border-surface-line bg-white p-3">
            <div className="flex h-20 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-surface-muted">
              {c.item.preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.item.preview} alt="First page preview" className="max-h-full max-w-full object-contain" />
              ) : (
                <span className="text-xs font-semibold text-ink-faint">PDF</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink" title={c.item.file.name}>{c.item.file.name}</p>
              <p className="text-xs text-ink-soft">
                {formatBytes(c.item.file.size)}
                {pages ? ` · ${pages} page${pages === 1 ? "" : "s"}` : c.item.state === "checking" ? " · reading…" : ""}
              </p>
              {c.item.error && <p className="mt-1 text-xs font-medium text-red-700">{c.item.error}</p>}
            </div>
            <button type="button" className="btn btn-secondary" onClick={c.startOver} disabled={busy}>
              Change file
            </button>
          </div>

          <fieldset className="space-y-2" disabled={busy}>
            <legend className="mb-1 text-sm font-semibold text-ink">How should it be compressed?</legend>
            {compressConfig.modes.map((m) => (
              <label key={m.value} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 ${c.mode === m.value ? "border-brand-600 bg-brand-50" : "border-surface-line bg-white"}`}>
                <input type="radio" name="compress-mode" className="mt-1 h-4 w-4 accent-brand-600" checked={c.mode === m.value} onChange={() => c.setMode(m.value)} />
                <span>
                  <span className="block text-sm font-semibold text-ink">{m.label}</span>
                  <span className="block text-sm text-ink-soft">{m.help}</span>
                </span>
              </label>
            ))}
          </fieldset>

          {c.mode === "flatten" && (
            <ErrorMessage
              tone="warning"
              messages={["Flatten mode turns every page into a picture. Text can no longer be selected, searched or copied, and links and form fields stop working."]}
            />
          )}

          <fieldset className="space-y-2" disabled={busy}>
            <legend className="mb-1 text-sm font-semibold text-ink">Quality level</legend>
            <div className="grid gap-2 sm:grid-cols-3">
              {compressConfig.levels.map((l) => (
                <label key={l.value} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 ${c.level === l.value ? "border-brand-600 bg-brand-50" : "border-surface-line bg-white"}`}>
                  <input type="radio" name="compress-level" className="mt-1 h-4 w-4 accent-brand-600" checked={c.level === l.value} onChange={() => c.setLevel(l.value)} />
                  <span>
                    <span className="block text-sm font-semibold text-ink">{l.label}</span>
                    <span className="block text-xs text-ink-soft">{l.help}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {c.mode === "flatten" && (
            <div className="space-y-3">
              <div className="space-y-2">
                <label htmlFor="compress-target" className="block text-sm font-semibold text-ink">
                  Size target (optional)
                </label>
                <select
                  id="compress-target"
                  className="input"
                  value={c.targetKb}
                  disabled={busy}
                  onChange={(e) => c.setTargetKb(Number(e.target.value) as TargetKb)}
                  aria-describedby="target-help"
                >
                  {compressConfig.targets.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <p id="target-help" className="text-sm text-ink-soft">
                  The tool tries a few quality settings and keeps the best one that fits. A target is an aim, not a promise: if even the smallest setting is too big, you are told.
                </p>
              </div>
              <label className="flex cursor-pointer items-start gap-3 text-sm text-ink">
                <input type="checkbox" className="mt-0.5 h-4 w-4 accent-brand-600" checked={c.grayscale} disabled={busy} onChange={(e) => c.setGrayscale(e.target.checked)} />
                <span>Convert to black and white (greyscale). Saves space on colour scans of text documents.</span>
              </label>
            </div>
          )}
          {c.problem && <ErrorMessage messages={[c.problem]} />}
        </div>
      )}

      {busy && (
        <div className="space-y-3">
          <ProgressBar value={c.processing.progress} label={c.processing.label} />
          <button type="button" className="btn btn-secondary" onClick={c.processing.cancel}>Cancel</button>
        </div>
      )}
      {c.processing.status === "error" && c.processing.error && <ErrorMessage messages={[c.processing.error]} />}
      {done && c.processing.result && <ResultPanel result={c.processing.result} onReset={c.startOver} resetLabel="Compress another PDF" />}

      {c.item && !done && !busy && (
        <button type="button" className="btn btn-primary" onClick={c.compress} disabled={!c.canCompress}>
          Compress PDF
        </button>
      )}
      <PrivacyNotice />
    </div>
  );
}
