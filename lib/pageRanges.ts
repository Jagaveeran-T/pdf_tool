import { ProcessingError } from "@/processing/contracts/errors";

export interface PageRange {
  /** 1-based, inclusive */
  start: number;
  end: number;
}

const MAX_TOKENS = 500;

/**
 * Parses "1-3, 5, 8-" into ranges. "8-" means page 8 to the last page.
 * Throws ProcessingError("INVALID_RANGE") with a readable message on any problem.
 */
export function parsePageRanges(input: string, totalPages: number): PageRange[] {
  const text = input.trim();
  if (!text) throw new ProcessingError("INVALID_RANGE", "Enter at least one page or range, for example 1-3, 5.");
  const tokens = text.split(",").map((t) => t.trim());
  if (tokens.length > MAX_TOKENS) throw new ProcessingError("INVALID_RANGE", "That is too many ranges.");

  const ranges: PageRange[] = [];
  for (const token of tokens) {
    if (token === "") throw new ProcessingError("INVALID_RANGE", "There is an empty entry between commas.");
    const m = /^(\d+)?\s*(-)?\s*(\d+)?$/.exec(token);
    if (!m || (!m[1] && !m[3])) {
      throw new ProcessingError("INVALID_RANGE", `"${token}" is not a valid page or range. Use numbers like 4 or 2-6.`);
    }
    let start: number;
    let end: number;
    if (!m[2]) {
      start = end = Number(m[1]);
    } else {
      if (!m[1]) throw new ProcessingError("INVALID_RANGE", `"${token}" needs a start page, for example 1-3.`);
      start = Number(m[1]);
      end = m[3] ? Number(m[3]) : totalPages;
    }
    if (start < 1 || end < 1) throw new ProcessingError("INVALID_RANGE", "Page numbers start at 1.");
    if (start > end) throw new ProcessingError("INVALID_RANGE", `"${token}" goes backwards. Write it as ${end}-${start}.`);
    if (end > totalPages) {
      throw new ProcessingError("INVALID_RANGE", `"${token}" is outside the document. This PDF has ${totalPages} page${totalPages === 1 ? "" : "s"}.`);
    }
    ranges.push({ start, end });
  }
  return ranges;
}

export function rangeLabel(r: PageRange): string {
  return r.start === r.end ? `${r.start}` : `${r.start}-${r.end}`;
}
