import { DEFAULT_PROFILE, ACCENT_PALETTES, FONT_OPTIONS } from "../constants/theme";

/**
 * Sanitizes a raw profile object by validating and defaulting its properties.
 * @param {object} raw
 * @returns {object}
 */
export const sanitizeProfile = (raw) => {
  const p = { ...DEFAULT_PROFILE };
  if (typeof raw.displayName === "string") p.displayName = raw.displayName;
  if (typeof raw.customAccent === "string") p.customAccent = raw.customAccent;
  if (typeof raw.customAccent2 === "string") p.customAccent2 = raw.customAccent2;
  if (typeof raw.customAccent3 === "string") p.customAccent3 = raw.customAccent3;
  p.paletteIdx = Number.isInteger(raw.paletteIdx) && raw.paletteIdx >= 0 && raw.paletteIdx < ACCENT_PALETTES.length ? raw.paletteIdx : DEFAULT_PROFILE.paletteIdx;
  p.fontIdx = Number.isInteger(raw.fontIdx) && raw.fontIdx >= 0 && raw.fontIdx < FONT_OPTIONS.length ? raw.fontIdx : DEFAULT_PROFILE.fontIdx;
  p.fontSize = typeof raw.fontSize === "number" && raw.fontSize >= 10 && raw.fontSize <= 24 ? raw.fontSize : DEFAULT_PROFILE.fontSize;
  return p;
};
