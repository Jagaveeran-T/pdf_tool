import { payloadSchema } from "../contracts/payloads";
import { serializeError } from "../contracts/errors";
import { runOperation } from "../providers/browser/pdfProcessor";
import type { WorkerRequest, WorkerResponse } from "./messages";

interface WorkerScope {
  postMessage(message: WorkerResponse): void;
  onmessage: ((event: MessageEvent<WorkerRequest>) => void) | null;
}
const ctx = self as unknown as WorkerScope;

ctx.onmessage = async (event) => {
  try {
    const parsed = payloadSchema.parse(event.data.payload);
    const result = await runOperation(parsed, (fraction, label) =>
      ctx.postMessage({ type: "progress", fraction, label }),
    );
    ctx.postMessage({ type: "result", result });
  } catch (err) {
    ctx.postMessage({ type: "error", error: serializeError(err) });
  }
};
