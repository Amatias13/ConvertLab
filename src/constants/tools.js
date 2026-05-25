/**
 * constants/tools.js — all tool-specific static data and configuration.
 *
 * WHY here and not in the tool components themselves:
 *  - Pure data has no dependencies and is trivially testable.
 *  - Centralizing it prevents the same values appearing in multiple files.
 *  - Components stay lean: they only import what they need from here.
 *
 * Sections:
 *  - Password Generator (charsets, strength levels)
 *  - Unit Converter (categories, toBase factors)
 *  - HTML Entities (encode map)
 *  - Number Formatter (locales)
 *  - Cron (presets)
 *  - SQL (keywords)
 *  - Lorem Ipsum (word bank)
 *  - AI Tool (modes)
 *  - Coffee Modal (options)
 *  - Feedback (types)
 *  - Color Tool (presets)
 *  - Image Tool (filter map)
 *  - Sidebar (action definitions)
 *  - CSV (delimiter options)
 *  - Hashing (algorithm list)
 *  - AI Models (model list)
 */

// ─── Password Generator ───────────────────────────────────────────
export const CHARSETS = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  digits: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{}|;:,.<>?",
  similar: "iIlL1oO0",
};

export const PASSWORD_STRENGTH_LEVELS = [
  { score: 0, label: "Too weak", color: "var(--accent2)" },
  { score: 2, label: "Weak", color: "var(--accent2)" },
  { score: 4, label: "Fair", color: "var(--accent4)" },
  { score: 5, label: "Good", color: "var(--accent5)" },
  { score: 6, label: "Strong", color: "var(--accent3)" },
  { score: 7, label: "Very strong", color: "var(--accent3)" },
];

// ─── Unit Converter ───────────────────────────────────────────────
export const UNIT_CATEGORIES = {
  Length: {
    units: ["mm", "cm", "m", "km", "in", "ft", "yd", "mi", "nm", "μm"],
    toBase: { mm: 0.001, cm: 0.01, m: 1, km: 1000, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344, nm: 1e-9, μm: 1e-6 },
  },
  Weight: {
    units: ["mg", "g", "kg", "t", "oz", "lb", "st"],
    toBase: { mg: 1e-6, g: 0.001, kg: 1, t: 1000, oz: 0.0283495, lb: 0.453592, st: 6.35029 },
  },
  Temperature: {
    units: ["°C", "°F", "K"],
    toBase: null, // special handling
  },
  Area: {
    units: ["mm²", "cm²", "m²", "km²", "in²", "ft²", "ac", "ha"],
    toBase: { "mm²": 1e-6, "cm²": 1e-4, "m²": 1, "km²": 1e6, "in²": 6.4516e-4, "ft²": 0.092903, ac: 4046.86, ha: 10000 },
  },
  Volume: {
    units: ["ml", "l", "m³", "fl oz", "cup", "pt", "qt", "gal"],
    toBase: { ml: 0.001, l: 1, "m³": 1000, "fl oz": 0.0295735, cup: 0.236588, pt: 0.473176, qt: 0.946353, gal: 3.78541 },
  },
  Speed: {
    units: ["m/s", "km/h", "mph", "kn", "ft/s"],
    toBase: { "m/s": 1, "km/h": 0.277778, mph: 0.44704, kn: 0.514444, "ft/s": 0.3048 },
  },
  Storage: {
    units: ["B", "KB", "MB", "GB", "TB", "PB", "KiB", "MiB", "GiB", "TiB"],
    toBase: { B: 1, KB: 1e3, MB: 1e6, GB: 1e9, TB: 1e12, PB: 1e15, KiB: 1024, MiB: 1048576, GiB: 1073741824, TiB: 1099511627776 },
  },
  Time: {
    units: ["ms", "s", "min", "h", "d", "wk", "mo", "yr"],
    toBase: { ms: 0.001, s: 1, min: 60, h: 3600, d: 86400, wk: 604800, mo: 2629746, yr: 31556952 },
  },
};

// ─── HTML Entities ────────────────────────────────────────────────
export const ENTITY_MAP = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "©": "&copy;",
  "®": "&reg;",
  "™": "&trade;",
  "€": "&euro;",
  "£": "&pound;",
  "¥": "&yen;",
  "¢": "&cent;",
  "°": "&deg;",
  "±": "&plusmn;",
  "×": "&times;",
  "÷": "&divide;",
  "→": "&rarr;",
  "←": "&larr;",
  "↑": "&uarr;",
  "↓": "&darr;",
  "↔": "&harr;",
  "…": "&hellip;",
  "—": "&mdash;",
  "–": "&ndash;",
  " ": "&nbsp;",
  "«": "&laquo;",
  "»": "&raquo;",
  "•": "&bull;",
  "‣": "&#8227;",
};

// ─── Cron Presets ─────────────────────────────────────────────────
export const CRON_PRESETS = [
  { label: "Every minute", value: "* * * * *" },
  { label: "Every hour", value: "0 * * * *" },
  { label: "Daily 9am", value: "0 9 * * *" },
  { label: "Weekdays 9am", value: "0 9 * * 1-5" },
  { label: "Every 15 min", value: "*/15 * * * *" },
  { label: "Monthly 1st", value: "0 0 1 * *" },
  { label: "Midnight", value: "0 0 * * *" },
];

// ─── SQL Keywords ─────────────────────────────────────────────────
export const SQL_KEYWORDS = [
  "SELECT",
  "FROM",
  "WHERE",
  "JOIN",
  "LEFT JOIN",
  "RIGHT JOIN",
  "INNER JOIN",
  "OUTER JOIN",
  "FULL JOIN",
  "ON",
  "AND",
  "OR",
  "NOT",
  "IN",
  "EXISTS",
  "IS NULL",
  "IS NOT NULL",
  "LIKE",
  "BETWEEN",
  "GROUP BY",
  "ORDER BY",
  "HAVING",
  "LIMIT",
  "OFFSET",
  "UNION",
  "INSERT INTO",
  "VALUES",
  "UPDATE",
  "SET",
  "DELETE FROM",
  "CREATE TABLE",
  "ALTER TABLE",
  "DROP TABLE",
  "INDEX",
  "DISTINCT",
  "AS",
  "CASE",
  "WHEN",
  "THEN",
  "ELSE",
  "END",
  "WITH",
  "RETURNS",
  "DECLARE",
];

// ─── SQL Clauses (for syntax highlighting) ─────────────────────────────────
export const SQL_CLAUSES = ["SELECT", "FROM", "WHERE", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "OUTER JOIN", "FULL JOIN", "JOIN", "GROUP BY", "ORDER BY", "HAVING", "LIMIT", "OFFSET", "UNION ALL", "UNION", "INSERT INTO", "VALUES", "SET", "ON"];

// ─── Lorem Ipsum word bank ────────────────────────────────────────
export const LOREM_WORDS =
  "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum".split(
    " ",
  );

// ─── AI Tool Modes ────────────────────────────────────────────────
export const AI_MODES = [
  { id: "improve", label: "✨ Improve", system: "Improve the grammar, style, and clarity. Keep the same meaning. Return ONLY the improved text, no explanations." },
  { id: "formal", label: "🎩 Formal", system: "Rewrite in a formal, professional tone. Return ONLY the rewritten text." },
  { id: "casual", label: "😊 Casual", system: "Rewrite in a friendly, casual tone. Return ONLY the rewritten text." },
  { id: "shorter", label: "✂️ Shorter", system: "Make more concise. Remove redundancy, keep key info. Return ONLY the shortened text." },
  { id: "longer", label: "📝 Expand", system: "Expand with detail and examples. Return ONLY the expanded text." },
  { id: "summarise", label: "📋 Summarise", system: "Write a 2-3 sentence summary. Return ONLY the summary." },
  { id: "bullets", label: "• Bullets", system: "Convert to bullet points. Return ONLY the bullet list." },
  { id: "keywords", label: "🏷 Keywords", system: "Extract 8-12 keywords. Return ONLY a comma-separated list." },
  { id: "translate", label: "🇵🇹 PT", system: "Translate to European Portuguese. Return ONLY the translation." },
  { id: "fix", label: "🔧 Fix grammar", system: "Fix grammar and spelling only. Return ONLY the corrected text." },
];

// ─── AI Models ─────────────────────────────────────────────────
export const AI_MODELS = [{ id: "openai", label: "GPT-4o" }];

// ─── Coffee options ───────────────────────────────────────────────
export const COFFEE_OPTIONS = [
  { label: "☕ One coffee", amount: "€3", color: "#ffba3b" },
  { label: "☕☕ Two coffees", amount: "€5", color: "#fd9a00" },
  { label: "🍕 A slice of pizza", amount: "€10", color: "#ff5f7e" },
];

// ─── Feedback types ───────────────────────────────────────────────
export const FEEDBACK_TYPES = [
  { id: "suggestion", label: "💡 Suggestion", desc: "Feature ideas or improvements" },
  { id: "bug", label: "🐛 Bug report", desc: "Something is broken or wrong" },
  { id: "praise", label: "⭐ Praise", desc: "Share what you love" },
  { id: "other", label: "💬 Other", desc: "Anything else" },
];

// ─── Color Tool Presets ───────────────────────────────────────────
// WHY: These are static data, not utility functions. They belong in
// constants/ not utils/. Moved from utils/color.js.
export const COLOR_PRESETS = [
  { name: "Indigo", hex: "#7c6dff" },
  { name: "Coral", hex: "#ff5f7e" },
  { name: "Mint", hex: "#3fe8a0" },
  { name: "Sky", hex: "#38b6ff" },
  { name: "Amber", hex: "#ffba3b" },
  { name: "Mauve", hex: "#a29bfe" },
  { name: "Teal", hex: "#00cec9" },
  { name: "Pink", hex: "#fd79a8" },
  { name: "Lime", hex: "#badc58" },
  { name: "Tomato", hex: "#e55039" },
  { name: "Navy", hex: "#2c3e50" },
  { name: "Gold", hex: "#f9ca24" },
];

// ─── Image Filter Map ─────────────────────────────────────────────
// WHY: Same — static CSS filter strings are configuration data, not logic.
export const IMAGE_FILTERS = {
  none: "none",
  grayscale: "grayscale(100%)",
  sepia: "sepia(100%)",
  invert: "invert(100%)",
  blur: "blur(3px)",
  brightness: "brightness(1.4)",
  contrast: "contrast(1.5)",
};

// ─── Sidebar Bottom Actions ───────────────────────────────────────
// WHY: Was defined as an inline array inside Sidebar.jsx on every render.
// Extracted so Sidebar just maps over it — no recreation, easy to extend.
export const SIDEBAR_ACTIONS = [
  { key: "theme", icon: null, title: "Toggle theme" }, // icon resolved at runtime (theme-dependent)
  { key: "feedback", icon: "💬", title: "Send feedback" },
  { key: "about", icon: "ℹ", title: "About ConvertLab" },
  { key: "coffee", icon: "☕", title: "Buy me a coffee" },
];

// ─── CSV Delimiters ───────────────────────────────────────────────
export const DELIMITERS = [
  { label: ",", value: "," },
  { label: ";", value: ";" },
  { label: "Tab", value: "\t" },
  { label: "|", value: "|" },
];

// ─── Hashing algorithms ───────────────────────────────────────────
export const ALGOS = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];

// ─── JWT Part Colors ─────────────────────────────────────────────
export const PARTCOLORS = {
  header: { bg: "#ff5f7e0a", label: "#ff5f7e", name: "Header" },
  payload: { bg: "#7c6dff0a", label: "#7c6dff", name: "Payload" },
  sig: { bg: "#3fe8a00a", label: "#3fe8a0", name: "Signature" },
};

// ─── Number Formatter Locales ─────────────────────────────────────
export const LOCALES = [
  { label: "PT (1.234,56)", locale: "pt-PT" },
  { label: "EN (1,234.56)", locale: "en-US" },
  { label: "DE (1.234,56)", locale: "de-DE" },
  { label: "FR (1 234,56)", locale: "fr-FR" },
  { label: "IN (1,23,456)", locale: "en-IN" },
  { label: "CH (1'234.56)", locale: "de-CH" },
];

// ─── Number Base Converter ────────────────────────────────────────
export const BASE_OPTIONS = [
  { id: "dec", label: "Decimal", sub: "base 10", radix: 10 },
  { id: "bin", label: "Binary", sub: "base 2", radix: 2 },
  { id: "oct", label: "Octal", sub: "base 8", radix: 8 },
  { id: "hex", label: "Hex", sub: "base 16", radix: 16 },
];
