"use client";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { FileList } from "@/components/common/FileList";
import { FileUploader } from "@/components/common/FileUploader";
import { PrivacyNotice } from "@/components/common/PrivacyNotice";
import { ProgressBar } from "@/components/common/ProgressBar";
import { ResultPanel } from "@/components/common/ResultPanel";
import { LIMITS } from "@/config/limits";
import { formatBytes } from "@/lib/formatBytes";
import type { useImagesToPdf } from "../hooks/useImagesToPdf";
import type { ImagesToPdfOptions, ImagesToPdfVariant } from "../types";

type State = ReturnType<typeof useImagesToPdf>;

function Select<T extends string>(props: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  disabled: boolean;
  onChange: (v: T) => void;
}) {
  return (
    <label className="block text-sm font-medium text-ink">
      {props.label}
      <select
        className="input mt-1"
        value={props.value}
        disabled={props.disabled}
        onChange={(e) => props.onChange(e.target.value as T)}
      >
        {props.options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ImagesToPdfView({ variant, state }: { variant: ImagesToPdfVariant; state: State }) {
  const { upload, processing, options, setOptions, convert, startOver } = state;
  const busy = processing.status === "processing";
  const set = <K extends keyof ImagesToPdfOptions>(k: K, v: ImagesToPdfOptions[K]) => setOptions({ ...options, [k]: v });

  return (
    <div className="space-y-4">
      {processing.status !== "done" && (
        <FileUploader
          accept={variant.inputAccept}
          label={variant.uploadLabel}
          hint={variant.uploadHint}
          disabled={busy}
          onFiles={(f) => void upload.addFiles(f)}
        />
      )}
      <ErrorMessage messages={upload.messages} onDismiss={upload.dismissMessages} />

      {upload.items.length > 0 && processing.status !== "done" && (
        <>
          <FileList
            items={upload.items}
            disabled={busy}
            allowRotate
            onRemove={upload.remove}
            onRotate={upload.rotate}
            onReorder={upload.reorder}
          />
          {upload.totalBytes > LIMITS.memoryWarningBytes && (
            <ErrorMessage
              tone="warning"
              messages={[`These files total ${formatBytes(upload.totalBytes)}. Phones and older computers may run out of memory; try fewer files if it fails.`]}
            />
          )}
          <fieldset className="grid gap-4 rounded-xl border border-surface-line bg-white p-4 sm:grid-cols-3" disabled={busy}>
            <legend className="px-1 text-sm font-semibold text-ink">Page layout</legend>
            <Select
              label="Page size"
              value={options.pageSize}
              disabled={busy}
              onChange={(v) => set("pageSize", v)}
              options={[
                { value: "a4", label: "A4 (210 × 297 mm)" },
                { value: "letter", label: "US Letter (8.5 × 11 in)" },
                { value: "fit", label: "Fit to image" },
              ]}
            />
            <Select
              label="Orientation"
              value={options.orientation}
              disabled={busy || options.pageSize === "fit"}
              onChange={(v) => set("orientation", v)}
              options={[
                { value: "auto", label: "Auto" },
                { value: "portrait", label: "Portrait" },
                { value: "landscape", label: "Landscape" },
              ]}
            />
            <Select
              label="Margin"
              value={options.margin}
              disabled={busy}
              onChange={(v) => set("margin", v)}
              options={[
                { value: "none", label: "None" },
                { value: "small", label: "Small" },
                { value: "medium", label: "Medium" },
              ]}
            />
          </fieldset>
        </>
      )}

      {busy && (
        <div className="space-y-3">
          <ProgressBar value={processing.progress} label={processing.label} />
          <button type="button" className="btn btn-secondary" onClick={processing.cancel}>
            Cancel
          </button>
        </div>
      )}

      {processing.status === "error" && processing.error && <ErrorMessage messages={[processing.error]} />}

      {processing.status === "done" && processing.result && <ResultPanel result={processing.result} onReset={startOver} />}

      {upload.items.length > 0 && !busy && processing.status !== "done" && (
        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="button" className="btn btn-primary" onClick={convert} disabled={upload.hasBlocking}>
            {variant.convertLabel}
          </button>
          <button type="button" className="btn btn-secondary" onClick={upload.clear}>
            Clear all
          </button>
        </div>
      )}
      <PrivacyNotice />
    </div>
  );
}
