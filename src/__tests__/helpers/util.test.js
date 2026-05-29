import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { formatRelativeTime, persist, hashString } from "../../helpers/util";

// ─── formatRelativeTime ───────────────────────────────────────────
describe("formatRelativeTime", () => {
  it("returns 'just now' for timestamps under 60s ago", () => {
    expect(formatRelativeTime(Date.now() - 10_000)).toBe("just now");
    expect(formatRelativeTime(Date.now() - 59_000)).toBe("just now");
  });

  it("returns minutes for 1–59 minutes ago", () => {
    expect(formatRelativeTime(Date.now() - 60_000)).toBe("1m ago");
    expect(formatRelativeTime(Date.now() - 300_000)).toBe("5m ago");
    expect(formatRelativeTime(Date.now() - 3540_000)).toBe("59m ago");
  });

  it("returns hours for 1–23 hours ago", () => {
    expect(formatRelativeTime(Date.now() - 3_600_000)).toBe("1h ago");
    expect(formatRelativeTime(Date.now() - 7_200_000)).toBe("2h ago");
  });

  it("returns days for >= 1 day ago", () => {
    expect(formatRelativeTime(Date.now() - 86_400_000)).toBe("1d ago");
    expect(formatRelativeTime(Date.now() - 172_800_000)).toBe("2d ago");
  });

  it("handles future timestamps with allowFuture=true", () => {
    expect(formatRelativeTime(Date.now() + 120_000, { allowFuture: true })).toBe("2m from now");
    expect(formatRelativeTime(Date.now() + 3_600_000, { allowFuture: true })).toBe("1h from now");
  });

  it("future timestamps without allowFuture use 'ago' suffix (treated as past)", () => {
    // Without allowFuture, isFuture=false, so "2m from now" becomes "2m ago"
    expect(formatRelativeTime(Date.now() + 120_000)).toBe("2m ago");
  });
});

// ─── persist ─────────────────────────────────────────────────────
describe("persist", () => {
  beforeEach(() => localStorage.clear());

  it("stores a string value", () => {
    persist("k", "hello");
    expect(localStorage.getItem("k")).toBe("hello");
  });

  it("JSON-stringifies non-string values", () => {
    persist("obj", { a: 1 });
    expect(localStorage.getItem("obj")).toBe('{"a":1}');
    persist("arr", [1, 2]);
    expect(localStorage.getItem("arr")).toBe("[1,2]");
  });

  it("does not throw when localStorage is unavailable", () => {
    const orig = localStorage.setItem.bind(localStorage);
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("quota"); });
    expect(() => persist("k", "v")).not.toThrow();
    vi.restoreAllMocks();
  });
});

// ─── hashString ──────────────────────────────────────────────────
describe("hashString", () => {
  it("returns a 64-char hex string", async () => {
    const h = await hashString("hello");
    expect(h).toMatch(/^[0-9a-f]{64}$/);
  });

  it("is deterministic", async () => {
    expect(await hashString("test")).toBe(await hashString("test"));
  });

  it("produces different hashes for different inputs", async () => {
    expect(await hashString("a")).not.toBe(await hashString("b"));
  });

  it("handles empty string", async () => {
    const h = await hashString("");
    expect(h).toHaveLength(64);
  });
});
