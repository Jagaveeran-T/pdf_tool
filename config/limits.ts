/**
 * Single source of truth for file limits. Used by validation, upload hints, tool copy and tests.
 * Limits are conservative because every file is processed in the visitor's browser memory.
 */
export const MB = 1024 * 1024;

export const LIMITS = {
  /** Image to PDF and JPG to PDF share the same limits. */
  images: { maxFiles: 50, maxFileBytes: 50 * MB, maxTotalBytes: 200 * MB },
  merge: { minFiles: 2, maxFiles: 20, maxFileBytes: 50 * MB, maxTotalBytes: 200 * MB },
  split: { maxFileBytes: 50 * MB, maxPages: 500, maxOutputFiles: 500 },
  compress: { maxFileBytes: 50 * MB, maxPages: 300, maxFlattenPages: 60 },
  /** Above this total size the tools show a low-memory warning (mainly for phones). */
  memoryWarningBytes: 100 * MB,
} as const;
