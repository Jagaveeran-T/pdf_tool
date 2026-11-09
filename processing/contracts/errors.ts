export type ErrorCode =
  | "ENCRYPTED_PDF"
  | "CORRUPT_PDF"
  | "CORRUPT_IMAGE"
  | "UNSUPPORTED_TYPE"
  | "TOO_LARGE"
  | "TOO_MANY_FILES"
  | "EMPTY"
  | "INVALID_RANGE"
  | "INVALID_PAYLOAD"
  | "OUT_OF_MEMORY"
  | "CANCELLED"
  | "UNKNOWN";

export class ProcessingError extends Error {
  readonly code: ErrorCode;
  constructor(code: ErrorCode, message: string) {
    super(message);
    this.name = "ProcessingError";
    this.code = code;
  }
}

export interface SerializedError {
  code: ErrorCode;
  message: string;
}

export function serializeError(err: unknown): SerializedError {
  if (err instanceof ProcessingError) return { code: err.code, message: err.message };
  const name = (err as { name?: string })?.name;
  const message = (err as { message?: string })?.message ?? "";
  if (name === "EncryptedPDFError" || /encrypted/i.test(message)) {
    return { code: "ENCRYPTED_PDF", message: USER_MESSAGES.ENCRYPTED_PDF };
  }
  if (name === "RangeError" && /memory|allocation|array buffer/i.test(message)) {
    return { code: "OUT_OF_MEMORY", message: USER_MESSAGES.OUT_OF_MEMORY };
  }
  if (/No PDF header|Failed to parse|Invalid|Unexpected|Expected instance/i.test(message)) {
    return { code: "CORRUPT_PDF", message: USER_MESSAGES.CORRUPT_PDF };
  }
  return { code: "UNKNOWN", message: USER_MESSAGES.UNKNOWN };
}

export function deserializeError(e: SerializedError): ProcessingError {
  return new ProcessingError(e.code, e.message);
}

export const USER_MESSAGES: Record<ErrorCode, string> = {
  ENCRYPTED_PDF:
    "This PDF is password-protected or encrypted, and this tool cannot open it. Remove the protection in the program that created it, then try again.",
  CORRUPT_PDF: "This PDF could not be read. It may be damaged or incomplete. Try opening it in a PDF viewer, or export it again from the original.",
  CORRUPT_IMAGE: "One of the images could not be read. It may be damaged or in an unsupported variant of the format.",
  UNSUPPORTED_TYPE: "That file type is not supported by this tool.",
  TOO_LARGE: "A file is larger than the limit for this tool.",
  TOO_MANY_FILES: "There are more files than this tool accepts at once.",
  EMPTY: "Add at least one file first.",
  INVALID_RANGE: "That page range is not valid.",
  INVALID_PAYLOAD: "The request was not valid. Please reload the page and try again.",
  OUT_OF_MEMORY:
    "Your device ran out of memory. Try fewer or smaller files, close other tabs, or use a computer instead of a phone.",
  CANCELLED: "Cancelled.",
  UNKNOWN: "Something went wrong while processing. Please try again, or try different files.",
};
