import { describe, it, expect } from "vitest";
import { sanitizeProfile } from "../../helpers/profile";
import { DEFAULT_PROFILE, ACCENT_PALETTES, FONT_OPTIONS } from "../../constants/theme";

describe("sanitizeProfile", () => {
  it("returns defaults for a completely empty object", () => {
    expect(sanitizeProfile({})).toEqual(DEFAULT_PROFILE);
  });

  it("preserves valid displayName", () => {
    expect(sanitizeProfile({ displayName: "André" }).displayName).toBe("André");
  });

  it("preserves valid customAccent values", () => {
    const p = sanitizeProfile({ customAccent: "#ff0000", customAccent2: "#00ff00", customAccent3: "#0000ff" });
    expect(p.customAccent).toBe("#ff0000");
    expect(p.customAccent2).toBe("#00ff00");
    expect(p.customAccent3).toBe("#0000ff");
  });

  it("ignores non-string customAccent", () => {
    expect(sanitizeProfile({ customAccent: 123 }).customAccent).toBe(DEFAULT_PROFILE.customAccent);
  });

  it("clamps paletteIdx to valid range", () => {
    expect(sanitizeProfile({ paletteIdx: -1 }).paletteIdx).toBe(DEFAULT_PROFILE.paletteIdx);
    expect(sanitizeProfile({ paletteIdx: ACCENT_PALETTES.length }).paletteIdx).toBe(DEFAULT_PROFILE.paletteIdx);
    expect(sanitizeProfile({ paletteIdx: 1 }).paletteIdx).toBe(1);
  });

  it("clamps fontIdx to valid range", () => {
    expect(sanitizeProfile({ fontIdx: -1 }).fontIdx).toBe(DEFAULT_PROFILE.fontIdx);
    expect(sanitizeProfile({ fontIdx: FONT_OPTIONS.length }).fontIdx).toBe(DEFAULT_PROFILE.fontIdx);
    expect(sanitizeProfile({ fontIdx: 2 }).fontIdx).toBe(2);
  });

  it("clamps fontSize to 10–24", () => {
    expect(sanitizeProfile({ fontSize: 9 }).fontSize).toBe(DEFAULT_PROFILE.fontSize);
    expect(sanitizeProfile({ fontSize: 25 }).fontSize).toBe(DEFAULT_PROFILE.fontSize);
    expect(sanitizeProfile({ fontSize: 16 }).fontSize).toBe(16);
  });

  it("ignores non-numeric fontSize", () => {
    expect(sanitizeProfile({ fontSize: "14" }).fontSize).toBe(DEFAULT_PROFILE.fontSize);
  });

  it("does not mutate the DEFAULT_PROFILE object", () => {
    const before = { ...DEFAULT_PROFILE };
    sanitizeProfile({ displayName: "test", paletteIdx: 3 });
    expect(DEFAULT_PROFILE).toEqual(before);
  });
});
