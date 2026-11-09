import type { ProcessingProvider } from "../../contracts/provider";
import { runInWorker, workersSupported } from "../../workers/workerClient";
import { runOperation } from "./pdfProcessor";

/**
 * Processes everything inside this browser tab: in a Web Worker when available, otherwise on the main thread.
 * Flatten-mode compression is the one exception: it needs a real canvas, so it always runs on the main thread
 * (pdf.js still parses in its own worker, and the loop yields between pages).
 */
export const browserProvider: ProcessingProvider = {
  id: "browser",
  async run(payload, options = {}) {
    const needsMainThread = payload.operation === "compress-pdf" && payload.mode === "flatten";
    if (workersSupported() && !needsMainThread) return runInWorker(payload, options);
    return runOperation(payload, options.onProgress, options.signal);
  },
};
