/**
 * Hashes a string using SHA-256 and returns the hex digest.
 * Used for generating a profile hash to detect changes without storing raw data.
 * @param {string} str - The input string to hash.
 * @returns {Promise<string>} The hex digest of the hashed string.
 * @throws Will throw an error if the hashing operation fails (e.g., unsupported environment).
 */
export const hashString = async (str) => {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

/**
 * Persists a value to localStorage under the specified key.
 * Handles stringification for non-string values and catches errors (e.g., quota exceeded).
 * @param {string} key - The localStorage key under which to store the value.
 * @param {*} value - The value to store; will be stringified if not already a string.
 */
export const persist = (key, value) => {
  try {
    localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
  } catch {
    /* quota/private mode */
  }
};

/**
 * Sanitizes a raw profile object by validating and defaulting its properties.
 * Ensures that only expected properties with valid types and values are included.
 * This prevents malformed data from causing issues in the app.
 * @param {object} raw - The raw profile object to sanitize.
 * @returns {object} The sanitized profile object with defaults applied.
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
