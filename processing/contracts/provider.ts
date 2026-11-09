import type { ProcessingPayload } from "./payloads";
import type { ProcessingResult, RunOptions } from "./types";

/** A provider turns a validated payload into a result. Only a browser provider exists: nothing is sent to a server. */
export interface ProcessingProvider {
  readonly id: "browser";
  run(payload: ProcessingPayload, options?: RunOptions): Promise<ProcessingResult>;
}
