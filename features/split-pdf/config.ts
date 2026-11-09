import { LIMITS } from "@/config/limits";
import { formatBytes } from "@/lib/formatBytes";
import type { SplitModeOption } from "./types";

export const splitConfig = {
  tool: "split-pdf" as const,
  inputAccept: "application/pdf,.pdf",
  uploadLabel: "Choose a PDF or drop it here",
  uploadHint: `One PDF at a time, up to ${formatBytes(LIMITS.split.maxFileBytes)} and ${LIMITS.split.maxPages} pages.`,
  modes: [
    { value: "extract", label: "Extract pages", help: "Everything you list goes into one new PDF, in the order you type it." },
    { value: "ranges", label: "Separate files per range", help: "Each comma-separated range becomes its own PDF. Several files arrive in one ZIP." },
    { value: "each-page", label: "Every page as its own PDF", help: "One PDF per page, delivered as a ZIP." },
  ] satisfies SplitModeOption[],
};

export function presetValue(preset: "first" | "last" | "odd" | "even", pages: number): string {
  if (preset === "first") return "1";
  if (preset === "last") return String(pages);
  const start = preset === "odd" ? 1 : 2;
  const list: number[] = [];
  for (let p = start; p <= pages; p += 2) list.push(p);
  return list.join(", ");
}
