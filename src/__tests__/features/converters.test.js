import { describe, it, expect } from "vitest";
import { UNIT_CATEGORIES } from "../../constants/tools";

// ── Inline pure functions from NumberFormatterTool ───────────────
function fmtNumber(n, locale, decimals, style) {
  if (isNaN(n)) return "—";
  return new Intl.NumberFormat(locale, {
    style,
    currency: style === "currency" ? "EUR" : undefined,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
}

function toRoman(num) {
  const vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const syms = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
  let res = "";
  vals.forEach((v, i) => {
    while (num >= v) { res += syms[i]; num -= v; }
  });
  return res;
}

// ── Inline pure functions from UnitConverterTool ─────────────────
function convertTemp(val, from, to) {
  let celsius;
  if (from === "°C") celsius = val;
  else if (from === "°F") celsius = ((val - 32) * 5) / 9;
  else celsius = val - 273.15;
  if (to === "°C") return celsius;
  if (to === "°F") return (celsius * 9) / 5 + 32;
  return celsius + 273.15;
}

function convertUnit(val, from, to, cat) {
  if (cat === "Temperature") return convertTemp(val, from, to);
  const toBase = UNIT_CATEGORIES[cat].toBase;
  return (val * toBase[from]) / toBase[to];
}

function fmt(n) {
  if (n === undefined || isNaN(n)) return "—";
  if (Math.abs(n) >= 1e9 || (Math.abs(n) < 1e-4 && n !== 0)) return n.toExponential(6);
  return parseFloat(n.toPrecision(10)).toString();
}

// ─── toRoman ─────────────────────────────────────────────────────
describe("toRoman", () => {
  it("converts 1 → I", () => expect(toRoman(1)).toBe("I"));
  it("converts 4 → IV", () => expect(toRoman(4)).toBe("IV"));
  it("converts 9 → IX", () => expect(toRoman(9)).toBe("IX"));
  it("converts 14 → XIV", () => expect(toRoman(14)).toBe("XIV"));
  it("converts 40 → XL", () => expect(toRoman(40)).toBe("XL"));
  it("converts 90 → XC", () => expect(toRoman(90)).toBe("XC"));
  it("converts 400 → CD", () => expect(toRoman(400)).toBe("CD"));
  it("converts 900 → CM", () => expect(toRoman(900)).toBe("CM"));
  it("converts 1994 → MCMXCIV", () => expect(toRoman(1994)).toBe("MCMXCIV"));
  it("converts 2024 → MMXXIV", () => expect(toRoman(2024)).toBe("MMXXIV"));
  it("converts 3999 → MMMCMXCIX", () => expect(toRoman(3999)).toBe("MMMCMXCIX"));
});

// ─── fmtNumber ───────────────────────────────────────────────────
describe("fmtNumber", () => {
  it("returns '—' for NaN", () => expect(fmtNumber(NaN, "en-US", 2, "decimal")).toBe("—"));
  it("formats decimal with 2 decimals", () => {
    expect(fmtNumber(1234.5, "en-US", 2, "decimal")).toBe("1,234.50");
  });
  it("formats zero decimals", () => {
    expect(fmtNumber(1234567, "en-US", 0, "decimal")).toBe("1,234,567");
  });
  it("formats percent", () => {
    expect(fmtNumber(0.25, "en-US", 0, "percent")).toBe("25%");
  });
  it("formats negative numbers", () => {
    expect(fmtNumber(-42.5, "en-US", 1, "decimal")).toBe("-42.5");
  });
});

// ─── convertTemp ─────────────────────────────────────────────────
describe("convertTemp", () => {
  it("0°C → 32°F", () => expect(convertTemp(0, "°C", "°F")).toBeCloseTo(32));
  it("100°C → 212°F", () => expect(convertTemp(100, "°C", "°F")).toBeCloseTo(212));
  it("32°F → 0°C", () => expect(convertTemp(32, "°F", "°C")).toBeCloseTo(0));
  it("212°F → 100°C", () => expect(convertTemp(212, "°F", "°C")).toBeCloseTo(100));
  it("0°C → 273.15K", () => expect(convertTemp(0, "°C", "K")).toBeCloseTo(273.15));
  it("273.15K → 0°C", () => expect(convertTemp(273.15, "K", "°C")).toBeCloseTo(0));
  it("same unit is identity", () => expect(convertTemp(42, "°C", "°C")).toBeCloseTo(42));
});

// ─── convertUnit ─────────────────────────────────────────────────
describe("convertUnit — Length", () => {
  it("1km → 1000m", () => expect(convertUnit(1, "km", "m", "Length")).toBeCloseTo(1000));
  it("1mi → ~1.609km", () => expect(convertUnit(1, "mi", "km", "Length")).toBeCloseTo(1.609, 2));
  it("1in → 2.54cm", () => expect(convertUnit(1, "in", "cm", "Length")).toBeCloseTo(2.54));
  it("identity: 5m → 5m", () => expect(convertUnit(5, "m", "m", "Length")).toBeCloseTo(5));
});

describe("convertUnit — Weight", () => {
  it("1kg → 1000g", () => expect(convertUnit(1, "kg", "g", "Weight")).toBeCloseTo(1000));
  it("1lb → ~0.4536kg", () => expect(convertUnit(1, "lb", "kg", "Weight")).toBeCloseTo(0.4536, 3));
});

describe("convertUnit — Storage", () => {
  it("1GB → 1000MB (SI units)", () => expect(convertUnit(1, "GB", "MB", "Storage")).toBeCloseTo(1000));
  it("1TB → 1000GB (SI units)", () => expect(convertUnit(1, "TB", "GB", "Storage")).toBeCloseTo(1000));
  it("1GiB → 1024MiB (binary units)", () => expect(convertUnit(1, "GiB", "MiB", "Storage")).toBeCloseTo(1024));
});

// ─── fmt ─────────────────────────────────────────────────────────
describe("fmt", () => {
  it("returns '—' for NaN", () => expect(fmt(NaN)).toBe("—"));
  it("returns '—' for undefined", () => expect(fmt(undefined)).toBe("—"));
  it("uses exponential for very large numbers", () => expect(fmt(1e10)).toContain("e"));
  it("uses exponential for very small numbers", () => expect(fmt(1e-5)).toContain("e"));
  it("formats normal numbers as strings", () => expect(fmt(42.5)).toBe("42.5"));
  it("handles zero", () => expect(fmt(0)).toBe("0"));
});
