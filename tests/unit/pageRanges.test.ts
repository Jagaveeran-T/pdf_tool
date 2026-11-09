import { describe, expect, it } from "vitest";
import { parsePageRanges, rangeLabel } from "@/lib/pageRanges";
import { ProcessingError } from "@/processing/contracts/errors";

describe("parsePageRanges", () => {
  it("parses single pages, ranges and open-ended ranges", () => {
    expect(parsePageRanges("1-3, 5, 8-", 10)).toEqual([
      { start: 1, end: 3 },
      { start: 5, end: 5 },
      { start: 8, end: 10 },
    ]);
  });

  it("tolerates spaces", () => {
    expect(parsePageRanges(" 2 - 4 ,6 ", 6)).toEqual([
      { start: 2, end: 4 },
      { start: 6, end: 6 },
    ]);
  });

  it.each([
    ["", "Enter at least one"],
    ["1,,2", "empty entry"],
    ["abc", "not a valid"],
    ["0", "start at 1"],
    ["5-2", "backwards"],
    ["-3", "needs a start"],
    ["11", "outside the document"],
    ["1-99", "outside the document"],
  ])("rejects %j with a readable message", (input, fragment) => {
    try {
      parsePageRanges(input, 10);
      throw new Error("should have thrown");
    } catch (e) {
      expect(e).toBeInstanceOf(ProcessingError);
      expect((e as ProcessingError).code).toBe("INVALID_RANGE");
      expect((e as ProcessingError).message).toContain(fragment);
    }
  });

  it("labels ranges", () => {
    expect(rangeLabel({ start: 4, end: 4 })).toBe("4");
    expect(rangeLabel({ start: 2, end: 6 })).toBe("2-6");
  });
});
