import { ProcessingError, deserializeError } from "../contracts/errors";
import type { ProcessingPayload } from "../contracts/payloads";
import type { ProcessingResult, RunOptions } from "../contracts/types";
import type { WorkerRequest, WorkerResponse } from "./messages";

export function workersSupported(): boolean {
  return typeof Worker !== "undefined";
}

/** Runs one job in a fresh Web Worker and terminates it afterwards, which releases all of its memory. */
export function runInWorker(payload: ProcessingPayload, options: RunOptions = {}): Promise<ProcessingResult> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("./pdf.worker.ts", import.meta.url), { type: "module" });
    const finish = () => {
      options.signal?.removeEventListener("abort", onAbort);
      worker.terminate();
    };
    const onAbort = () => {
      finish();
      reject(new ProcessingError("CANCELLED", "Cancelled."));
    };
    if (options.signal?.aborted) {
      onAbort();
      return;
    }
    options.signal?.addEventListener("abort", onAbort);

    worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
      const msg = e.data;
      if (msg.type === "progress") options.onProgress?.(msg.fraction, msg.label);
      else if (msg.type === "result") {
        finish();
        resolve(msg.result);
      } else {
        finish();
        reject(deserializeError(msg.error));
      }
    };
    worker.onerror = () => {
      finish();
      reject(new ProcessingError("UNKNOWN", "The background worker failed to start. Please reload the page."));
    };
    const request: WorkerRequest = { type: "run", payload };
    worker.postMessage(request);
  });
}
