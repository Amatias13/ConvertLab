import { describe, it, expect } from "vitest";
import { hexToRgb, rgbToHex, rgbToHsl, hslToHex, darken } from "../../helpers/color";

describe("hexToRgb", () => {
  it("converts white", () => expect(hexToRgb("#ffffff")).toEqual({ r: 255, g: 255, b: 255 }));
  it("converts black", () => expect(hexToRgb("#000000")).toEqual({ r: 0, g: 0, b: 0 }));
  it("converts a mid colour", () => expect(hexToRgb("#7c6dff")).toEqual({ r: 124, g: 109, b: 255 }));
});

describe("rgbToHex", () => {
  it("converts white", () => expect(rgbToHex(255, 255, 255)).toBe("#ffffff"));
  it("converts black", () => expect(rgbToHex(0, 0, 0)).toBe("#000000"));
  it("pads single-digit hex components", () => expect(rgbToHex(1, 2, 3)).toBe("#010203"));
  it("round-trips with hexToRgb", () => {
    const { r, g, b } = hexToRgb("#7c6dff");
    expect(rgbToHex(r, g, b)).toBe("#7c6dff");
  });
});

describe("rgbToHsl", () => {
  it("white → h=0 s=0 l=100", () => {
    const { h, s, l } = rgbToHsl(255, 255, 255);
    expect(h).toBeCloseTo(0);
    expect(s).toBeCloseTo(0);
    expect(l).toBeCloseTo(100);
  });

  it("black → h=0 s=0 l=0", () => {
    const { h, s, l } = rgbToHsl(0, 0, 0);
    expect(h).toBeCloseTo(0);
    expect(s).toBeCloseTo(0);
    expect(l).toBeCloseTo(0);
  });

  it("pure red → h≈0 s=100 l=50", () => {
    const { h, s, l } = rgbToHsl(255, 0, 0);
    expect(h).toBeCloseTo(0);
    expect(s).toBeCloseTo(100);
    expect(l).toBeCloseTo(50);
  });

  it("pure green → h≈120 s=100 l=50 (covers case g branch)", () => {
    const { h, s, l } = rgbToHsl(0, 255, 0);
    expect(h).toBeCloseTo(120);
    expect(s).toBeCloseTo(100);
    expect(l).toBeCloseTo(50);
  });

  it("pure blue → h≈240 s=100 l=50 (covers case b branch)", () => {
    const { h, s, l } = rgbToHsl(0, 0, 255);
    expect(h).toBeCloseTo(240);
    expect(s).toBeCloseTo(100);
    expect(l).toBeCloseTo(50);
  });
});

describe("hslToHex", () => {
  it("h=0 s=0 l=100 → white", () => expect(hslToHex(0, 0, 100)).toBe("#ffffff"));
  it("h=0 s=0 l=0 → black", () => expect(hslToHex(0, 0, 0)).toBe("#000000"));
  it("round-trips rgb→hsl→hex", () => {
    const { h, s, l } = rgbToHsl(124, 109, 255);
    expect(hslToHex(h, s, l)).toBe("#7c6dff");
  });
});

describe("darken", () => {
  it("darkens by subtracting from each channel", () => {
    expect(darken("#ffffff", 10)).toBe("#f5f5f5");
  });

  it("clamps at 0, never goes negative", () => {
    expect(darken("#000000", 50)).toBe("#000000");
  });

  it("returns input unchanged when hex is falsy", () => {
    expect(darken("", 10)).toBe("");
    expect(darken(null, 10)).toBe(null);
  });
});
