import { describe, it, expect } from "vitest";
import { diff } from "../../helpers/diff";

describe("diff", () => {
  it("returns empty array for two empty strings", () => {
    expect(diff("", "")).toEqual([]);
  });

  it("marks identical lines as '='", () => {
    const result = diff("hello", "hello");
    expect(result).toEqual([{ t: "=", v: "hello" }]);
  });

  it("marks added lines as '+'", () => {
    const result = diff("", "new line");
    expect(result.some((r) => r.t === "+" && r.v === "new line")).toBe(true);
  });

  it("marks removed lines as '-'", () => {
    const result = diff("old line", "");
    expect(result.some((r) => r.t === "-" && r.v === "old line")).toBe(true);
  });

  it("handles multi-line diffs", () => {
    const a = "line1\nline2\nline3";
    const b = "line1\nchanged\nline3";
    const result = diff(a, b);
    const types = result.map((r) => r.t);
    expect(types).toContain("=");
    expect(types).toContain("-");
    expect(types).toContain("+");
  });

  it("produces correct LCS for a known example", () => {
    const result = diff("a\nb\nc", "a\nx\nc");
    expect(result.find((r) => r.v === "a")?.t).toBe("=");
    expect(result.find((r) => r.v === "b")?.t).toBe("-");
    expect(result.find((r) => r.v === "x")?.t).toBe("+");
    expect(result.find((r) => r.v === "c")?.t).toBe("=");
  });

  it("handles one empty side", () => {
    const result = diff("only\nhere", "");
    // diff("only\nhere", "") compares ['only','here'] vs [''] — the empty string
    // is treated as a line, so result contains '-' for 'only' and 'here'
    // and the empty string from b may appear as '=' or '+'. Just verify removals exist.
    expect(result.some((r) => r.t === "-")).toBe(true);
    expect(result.find((r) => r.v === "only")?.t).toBe("-");
    expect(result.find((r) => r.v === "here")?.t).toBe("-");
  });
});
