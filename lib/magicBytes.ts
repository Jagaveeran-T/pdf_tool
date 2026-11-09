export type DetectedType = "pdf" | "jpeg" | "png" | "webp";

const startsWith = (b: Uint8Array, sig: number[], offset = 0) =>
  b.length >= offset + sig.length && sig.every((v, i) => b[offset + i] === v);

/**
 * Detects a file type from its first bytes. File names and MIME types are never trusted.
 * PDFs may have a few bytes of junk before the header, so we scan the first 1024 bytes for "%PDF-".
 */
export function detectFileType(bytes: Uint8Array): DetectedType | null {
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return "jpeg";
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "png";
  if (startsWith(bytes, [0x52, 0x49, 0x46, 0x46]) && startsWith(bytes, [0x57, 0x45, 0x42, 0x50], 8)) return "webp";
  const limit = Math.min(bytes.length - 4, 1024);
  for (let i = 0; i <= limit; i++) {
    if (startsWith(bytes, [0x25, 0x50, 0x44, 0x46, 0x2d], i)) return "pdf";
  }
  return null;
}

export const KIND_LABEL: Record<DetectedType, string> = {
  pdf: "PDF",
  jpeg: "JPG",
  png: "PNG",
  webp: "WebP",
};
