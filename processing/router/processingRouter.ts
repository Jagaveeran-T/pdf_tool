import { payloadSchema, type ProcessingPayload } from "../contracts/payloads";
import { ProcessingError } from "../contracts/errors";
import type { ProcessingProvider } from "../contracts/provider";
import type { ProcessingResult, RunOptions } from "../contracts/types";

export interface ProcessingRouter {
  run(payload: unknown, options?: RunOptions): Promise<ProcessingResult>;
}

/** Validates the payload with zod, then hands it to the provider. */
export function createRouter(provider: ProcessingProvider): ProcessingRouter {
  return {
    async run(raw, options) {
      const parsed = payloadSchema.safeParse(raw);
      if (!parsed.success) {
        throw new ProcessingError("INVALID_PAYLOAD", parsed.error.issues[0]?.message ?? "Invalid request.");
      }
      return provider.run(parsed.data as ProcessingPayload, options);
    },
  };
}

let defaultRouter: ProcessingRouter | null = null;

/** The app's router. The browser provider is imported lazily so pdf-lib is not in the initial bundle. */
export async function getRouter(): Promise<ProcessingRouter> {
  if (!defaultRouter) {
    const { browserProvider } = await import("../providers/browser/browserProvider");
    defaultRouter = createRouter(browserProvider);
  }
  return defaultRouter;
}
