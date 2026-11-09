import type { ProcessingPayload } from "../contracts/payloads";
import type { SerializedError } from "../contracts/errors";
import type { ProcessingResult } from "../contracts/types";

export type WorkerRequest = { type: "run"; payload: ProcessingPayload };

export type WorkerResponse =
  | { type: "progress"; fraction: number; label?: string }
  | { type: "result"; result: ProcessingResult }
  | { type: "error"; error: SerializedError };
