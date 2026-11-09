"use client";
import { useDownload } from "@/hooks/useDownload";
import { formatBytes } from "@/lib/formatBytes";
import type { ProcessingResult } from "@/processing/contracts/types";

export function DownloadButton({ result }: { result: ProcessingResult }) {
  const download = useDownload();
  return (
    <button type="button" className="btn btn-primary w-full sm:w-auto" onClick={() => download(result)}>
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Download {result.filename} ({formatBytes(result.blob.size)})
    </button>
  );
}
