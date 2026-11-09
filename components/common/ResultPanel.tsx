"use client";
import type { ProcessingResult } from "@/processing/contracts/types";
import { formatBytes } from "@/lib/formatBytes";
import { DownloadButton } from "./DownloadButton";

interface Props {
  result: ProcessingResult;
  onReset: () => void;
  resetLabel?: string;
}

export function ResultPanel({ result, onReset, resetLabel = "Start over" }: Props) {
  const compared = result.originalBytes !== undefined;
  const unchanged = Boolean(result.unchanged);
  const summary = unchanged
    ? "We could not make this file smaller."
    : result.outputCount !== undefined
      ? `${result.outputCount} PDF files are ready in one ZIP.`
      : `Your PDF is ready${result.pageCount ? ` (${result.pageCount} page${result.pageCount === 1 ? "" : "s"})` : ""}.`;
  const tone = unchanged ? "border-amber-200 bg-amber-50 text-amber-900" : "border-emerald-200 bg-emerald-50 text-emerald-900";

  let sizeLine: string | null = null;
  if (compared && !unchanged) {
    const before = result.originalBytes as number;
    const after = result.blob.size;
    const pct = Math.round(((before - after) / before) * 100);
    sizeLine = `${formatBytes(before)} → ${formatBytes(after)} (${pct}% smaller)`;
  }

  return (
    <div role="status" className={`space-y-4 rounded-xl border p-4 ${tone}`}>
      <p className="font-semibold">{summary}</p>
      {sizeLine && <p className="text-sm font-medium">{sizeLine}</p>}
      {result.note && <p className="text-sm">{result.note}</p>}
      <p className="text-sm opacity-80">
        {unchanged
          ? "The download below is your original file. Nothing was uploaded."
          : "Open the file and scroll through it before you send it anywhere. Nothing was uploaded."}
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <DownloadButton result={result} />
        <button type="button" className="btn btn-secondary" onClick={onReset}>
          {resetLabel}
        </button>
      </div>
    </div>
  );
}
