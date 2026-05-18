/**
 * Color conversion utilities for ConvertLab.
 * Provides functions to convert between hex, RGB, and HSL color formats.
 * These functions are used throughout the app for color manipulation and display.
 * @param {string} hex - The hex color code to convert (e.g., "#7c6dff").
 * @returns {string} The converted color in the desired format.
 */
export function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

/**
 * Darkens a hex color by a specified amount.
 * Used to create a darker accent color for light themes to maintain contrast.
 * @param {string} hex - The hex color code to darken (e.g., "#7c6dff").
 * @param {number} amt - The amount to darken the color (0-255).
 * @returns {string} The darkened hex color code.
 */
export const darken = (hex, amt) => {
  if (!hex) return hex;
  const num = parseInt(hex.slice(1), 16);
  const r = Math.max(0, (num >> 16) - amt);
  const g = Math.max(0, ((num >> 8) & 0xff) - amt);
  const b = Math.max(0, (num & 0xff) - amt);
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
};

/**
 * Converts RGB color values to a hex color code.
 * @param {number} r - The red component (0-255).
 * @param {number} g - The green component (0-255).
 * @param {number} b - The blue component (0-255).
 * @returns {string} The corresponding hex color code (e.g., "#7c6dff").
 */
export function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}

/**
 * Converts RGB color values to HSL.
 * @param {number} r - The red component (0-255).
 * @param {number} g - The green component (0-255).
 * @param {number} b - The blue component (0-255).
 * @returns {object} The corresponding HSL values (h: 0-360, s: 0-100, l: 0-100).
 */
export function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

/**
 * Converts HSL color values to a hex color code.
 * @param {number} h - The hue component (0-360).
 * @param {number} s - The saturation component (0-100).
 * @param {number} l - The lightness component (0-100).
 * @returns {string} The corresponding hex color code (e.g., "#7c6dff").
 */
export function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    return Math.round(255 * (l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)))
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}
