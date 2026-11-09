import { detectFileType, KIND_LABEL, type DetectedType } from "./magicBytes";
import { formatBytes } from "./formatBytes";

export interface ValidationRules {
  accept: DetectedType[];
  maxFileBytes: number;
  maxFiles: number;
  maxTotalBytes: number;
}

export interface ExistingState {
  count: number;
  totalBytes: number;
}

export interface Rejection {
  name: string;
  code: "EMPTY" | "TOO_LARGE" | "TOO_MANY_FILES" | "TOTAL_TOO_LARGE" | "UNSUPPORTED_TYPE";
  message: string;
}

export interface Accepted {
  file: File;
  kind: DetectedType;
}

export interface ValidationResult {
  accepted: Accepted[];
  rejected: Rejection[];
}

export async function readHeader(file: Blob, length = 1100): Promise<Uint8Array> {
  return new Uint8Array(await file.slice(0, length).arrayBuffer());
}

export function describeAccepted(accept: DetectedType[]): string {
  return accept.map((k) => KIND_LABEL[k]).join(", ");
}

/** Validates files by size, count and real content type (magic bytes). Pure apart from reading file headers. */
export async function validateFiles(
  files: File[],
  rules: ValidationRules,
  existing: ExistingState = { count: 0, totalBytes: 0 },
): Promise<ValidationResult> {
  const accepted: Accepted[] = [];
  const rejected: Rejection[] = [];
  let count = existing.count;
  let total = existing.totalBytes;

  for (const file of files) {
    if (file.size === 0) {
      rejected.push({ name: file.name, code: "EMPTY", message: `"${file.name}" is empty.` });
      continue;
    }
    if (file.size > rules.maxFileBytes) {
      rejected.push({
        name: file.name,
        code: "TOO_LARGE",
        message: `"${file.name}" is ${formatBytes(file.size)}. The limit is ${formatBytes(rules.maxFileBytes)} per file.`,
      });
      continue;
    }
    if (count >= rules.maxFiles) {
      rejected.push({
        name: file.name,
        code: "TOO_MANY_FILES",
        message: `"${file.name}" was not added. You can use up to ${rules.maxFiles} files at once.`,
      });
      continue;
    }
    if (total + file.size > rules.maxTotalBytes) {
      rejected.push({
        name: file.name,
        code: "TOTAL_TOO_LARGE",
        message: `"${file.name}" was not added. The combined size limit is ${formatBytes(rules.maxTotalBytes)}.`,
      });
      continue;
    }
    const kind = detectFileType(await readHeader(file));
    if (!kind || !rules.accept.includes(kind)) {
      rejected.push({
        name: file.name,
        code: "UNSUPPORTED_TYPE",
        message: `"${file.name}" is not a supported file. This tool accepts ${describeAccepted(rules.accept)}.`,
      });
      continue;
    }
    accepted.push({ file, kind });
    count++;
    total += file.size;
  }
  return { accepted, rejected };
}
