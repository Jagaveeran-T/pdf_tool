"use client";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { FileList } from "@/components/common/FileList";
import { FileUploader } from "@/components/common/FileUploader";
import { PrivacyNotice } from "@/components/common/PrivacyNotice";
import { ProgressBar } from "@/components/common/ProgressBar";
import { ResultPanel } from "@/components/common/ResultPanel";
import { LIMITS } from "@/config/limits";
import { formatBytes } from "@/lib/formatBytes";
import { mergeConfig } from "../config";
import { useMergePdf } from "../hooks/useMergePdf";

export default function MergePdfPanel() {
  const { upload, processing, ui, merge, startOver } = useMergePdf();
  const busy = processing.status === "processing";
  const done = processing.status === "done";

  return (
    <div className="space-y-4">
      {!done && (
        <FileUploader
          accept={mergeConfig.inputAccept}
          label={mergeConfig.uploadLabel}
          hint={mergeConfig.uploadHint}
          disabled={busy}
          onFiles={(f) => void upload.addFiles(f)}
        />
      )}
      <ErrorMessage messages={upload.messages} onDismiss={upload.dismissMessages} />

      {!done && upload.items.length > 0 && (
        <>
          <FileList items={upload.items} disabled={busy} allowRotate onRemove={upload.remove} onRotate={upload.rotate} onReorder={upload.reorder} />
          {upload.totalBytes > LIMITS.memoryWarningBytes && (
            <ErrorMessage
              tone="warning"
              messages={[`These files total ${formatBytes(upload.totalBytes)}. Phones and older computers may run out of memory; merge in smaller batches if it fails.`]}
            />
          )}
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
      {done && processing.result && <ResultPanel result={processing.result} onReset={startOver} resetLabel="Merge more files" />}

      {!done && !busy && upload.items.length > 0 && (
        <div className="space-y-2">
          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="button" className="btn btn-primary" onClick={merge} disabled={!ui.canMerge}>
              Merge PDFs
            </button>
            <button type="button" className="btn btn-secondary" onClick={upload.clear}>
              Clear all
            </button>
          </div>
          {!ui.canMerge && ui.reason && <p className="text-sm text-ink-soft">{ui.reason}</p>}
        </div>
      )}
      <PrivacyNotice />
    </div>
  );
}
