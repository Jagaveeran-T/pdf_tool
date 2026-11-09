export type OperationName = "images-to-pdf" | "merge-pdf" | "split-pdf" | "compress-pdf";

export interface ProcessingResult {
  blob: Blob;
  filename: string;
  mimeType: string;
  /** Number of pages in the produced PDF, when a single PDF is produced. */
  pageCount?: number;
  /** Number of files inside a ZIP, when a ZIP is produced. */
  outputCount?: number;
  /** Size in bytes of the file the visitor supplied, for operations that compare before and after. */
  originalBytes?: number;
  /** True when the result is the visitor's original file because the operation could not make it smaller. */
  unchanged?: boolean;
  /** Plain-language explanation shown next to the result (limits, trade-offs, unmet targets). */
  note?: string;
}

export type ProgressCallback = (fraction: number, label?: string) => void;

export interface RunOptions {
  onProgress?: ProgressCallback;
  signal?: AbortSignal;
}
