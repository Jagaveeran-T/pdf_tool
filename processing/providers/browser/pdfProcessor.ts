import type { ProcessingPayload } from "../../contracts/payloads";
import type { ProcessingResult, ProgressCallback } from "../../contracts/types";
import { imagesToPdf } from "../../operations/imagesToPdf";
import { compressKeepText } from "../../operations/compress";
import { mergePdfs } from "../../operations/merge";
import { splitPdf } from "../../operations/split";
import { prepareImage } from "./imageProcessor";

/** Dispatches a validated payload to the matching operation. Runs in the worker (or main thread as a fallback). */
export async function runOperation(
  payload: ProcessingPayload,
  onProgress?: ProgressCallback,
  signal?: AbortSignal,
): Promise<ProcessingResult> {
  switch (payload.operation) {
    case "images-to-pdf": {
      const prepared = [];
      for (let i = 0; i < payload.files.length; i++) {
        onProgress?.((i / payload.files.length) * 0.5, `Reading image ${i + 1} of ${payload.files.length}`);
        prepared.push(await prepareImage(payload.files[i] as File, payload.rotations?.[i] ?? 0));
      }
      return imagesToPdf(prepared, payload.options, payload.outputName, (f, l) => onProgress?.(0.5 + f * 0.5, l));
    }
    case "merge-pdf": {
      const inputs = [];
      for (const file of payload.files) inputs.push({ name: file.name, bytes: new Uint8Array(await file.arrayBuffer()), rotation: payload.rotations?.[inputs.length] ?? 0 });
      return mergePdfs(inputs, payload.outputName, onProgress);
    }
    case "split-pdf": {
      const bytes = new Uint8Array(await payload.file.arrayBuffer());
      return splitPdf(bytes, payload.file.name, { mode: payload.mode, ranges: payload.ranges }, onProgress);
    }
    case "compress-pdf": {
      const bytes = new Uint8Array(await payload.file.arrayBuffer());
      if (payload.mode === "keep-text") {
        return compressKeepText(bytes, payload.file.name, payload.level, undefined, onProgress, signal);
      }
      // Flatten mode needs a real canvas and pdf.js, so it only ever runs on the main thread (see browserProvider).
      const { flattenCompress } = await import("../../operations/flatten");
      return flattenCompress(bytes, payload.file.name, { level: payload.level, targetKb: payload.targetKb, grayscale: payload.grayscale }, onProgress, signal);
    }
    default: {
      const unreachable: never = payload;
      throw new Error(`Unknown operation: ${JSON.stringify(unreachable)}`);
    }
  }
}
