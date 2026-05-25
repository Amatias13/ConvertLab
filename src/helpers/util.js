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
 * Formats a timestamp (ms) as a human-readable relative string.
 * @param {number} ts - Unix timestamp in milliseconds
 * @param {{ future?: boolean }} opts - if future=true, handles future dates with "from now"
 * @returns {string} e.g. "just now", "3m ago", "2h ago", "5d ago"
 */
export const formatRelativeTime = (ts, { allowFuture = false } = {}) => {
  const diff = (Date.now() - ts) / 1000;
  const abs = Math.abs(diff);
  const isFuture = allowFuture && diff < 0;
  const suffix = isFuture ? " from now" : " ago";
  if (abs < 60) return isFuture ? "just now" : "just now";
  if (abs < 3600) return Math.round(abs / 60) + "m" + suffix;
  if (abs < 86400) return Math.round(abs / 3600) + "h" + suffix;
  return Math.round(abs / 86400) + "d" + suffix;
};
