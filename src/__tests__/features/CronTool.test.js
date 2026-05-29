import { describe, it, expect } from "vitest";

// ── Inline the pure cron logic (not exported from CronTool) ──────
function matches(field, val) {
  if (field === "*") return true;
  if (field.startsWith("*/")) return val % parseInt(field.slice(2)) === 0;
  if (field.includes("-")) {
    const [a, b] = field.split("-").map(Number);
    return val >= a && val <= b;
  }
  if (field.includes(",")) return field.split(",").map(Number).includes(val);
  return parseInt(field) === val;
}

function getNextRuns(expr, count = 5) {
  const parts = expr.split(/\s+/);
  if (parts.length !== 5) return [];
  const [min, hour, day, month, wd] = parts;
  const results = [];
  const d = new Date();
  d.setSeconds(0, 0);
  d.setMinutes(d.getMinutes() + 1);
  let tries = 0;
  while (results.length < count && tries < 527040) {
    tries++;
    if (
      matches(month, d.getMonth() + 1) &&
      matches(day, d.getDate()) &&
      matches(wd, d.getDay()) &&
      matches(hour, d.getHours()) &&
      matches(min, d.getMinutes())
    ) results.push(new Date(d));
    d.setMinutes(d.getMinutes() + 1);
  }
  return results;
}

// ─── matches() ───────────────────────────────────────────────────
describe("cron matches()", () => {
  it("'*' matches any value", () => {
    expect(matches("*", 0)).toBe(true);
    expect(matches("*", 59)).toBe(true);
  });

  it("exact number matches", () => {
    expect(matches("5", 5)).toBe(true);
    expect(matches("5", 6)).toBe(false);
  });

  it("step */n matches multiples", () => {
    expect(matches("*/15", 0)).toBe(true);
    expect(matches("*/15", 15)).toBe(true);
    expect(matches("*/15", 30)).toBe(true);
    expect(matches("*/15", 7)).toBe(false);
  });

  it("range a-b is inclusive", () => {
    expect(matches("9-17", 9)).toBe(true);
    expect(matches("9-17", 17)).toBe(true);
    expect(matches("9-17", 8)).toBe(false);
    expect(matches("9-17", 18)).toBe(false);
  });

  it("list matches any listed value", () => {
    expect(matches("1,3,5", 1)).toBe(true);
    expect(matches("1,3,5", 3)).toBe(true);
    expect(matches("1,3,5", 2)).toBe(false);
  });
});

// ─── getNextRuns() ───────────────────────────────────────────────
describe("cron getNextRuns()", () => {
  it("returns empty array for invalid expressions", () => {
    expect(getNextRuns("* * * *")).toEqual([]);        // 4 parts
    expect(getNextRuns("* * * * * *")).toEqual([]);    // 6 parts
    expect(getNextRuns("")).toEqual([]);
  });

  it("returns Date objects", () => {
    const runs = getNextRuns("* * * * *", 1);
    expect(runs).toHaveLength(1);
    expect(runs[0]).toBeInstanceOf(Date);
  });

  it("returns the requested count", () => {
    expect(getNextRuns("* * * * *", 5)).toHaveLength(5);
    expect(getNextRuns("* * * * *", 10)).toHaveLength(10);
  });

  it("returns empty for impossible expression (Feb 31)", () => {
    expect(getNextRuns("0 0 31 2 *", 1)).toHaveLength(0);
  });

  it("all returned times are in the future", () => {
    const now = Date.now();
    getNextRuns("* * * * *", 5).forEach((d) => {
      expect(d.getTime()).toBeGreaterThan(now);
    });
  });

  it("returned times are in ascending order", () => {
    const runs = getNextRuns("*/5 * * * *", 5);
    for (let i = 1; i < runs.length; i++) {
      expect(runs[i].getTime()).toBeGreaterThan(runs[i - 1].getTime());
    }
  });
});
