/**
 * constants/app.js — application-wide constants that do not belong to a
 * specific feature or tool.
 *
 * Includes: localStorage keys, app metadata, external URLs,
 * toast duration, and reading speed used for text analysis.
 *
 * WHY centralised: magic strings scattered across files cause drift when
 * a value changes (e.g. renaming a storage key). One place = one change.
 */

// ─── Storage Keys ─────────────────────────────────────────────────
export const STORAGE_KEYS = {
  THEME: "cl-theme",
  PROFILE: "cl-profile",
  PROFILE_HASH: "cl-profile-hash",
  SIDEBAR: "cl-sidebar",
  FAVORITES: "cl-favs",
  HISTORY: "cl-history",
  NOTIFICATIONS: "cl-notifs",
};

// ─── App Metadata ─────────────────────────────────────────────────
export const APP_NAME = "ConvertLab";
export const APP_VERSION = "2.0";
export const GITHUB_URL = "https://github.com/Amatias13/ConvertLab";
export const BUY_COFFEE_URL = "https://buymeacoffee.com/andrematiasdev";
export const QR_API_BASE = "https://api.qrserver.com/v1/create-qr-code";

// ─── Default Tool ─────────────────────────────────────────────────
export const DEFAULT_TOOL = "json";

// ─── Toast durations (ms) ─────────────────────────────────────────
export const TOAST_DURATION = 2800;

// ─── Reading speed (words per minute) ────────────────────────────
export const READING_WPM = 238;

// ─── Keyboard Shortcuts ───────────────────────────────────────────
export const SHORTCUTS = [
  { keys: ["⌘", "K"], desc: "Search tools" },
  { keys: ["?"], desc: "Show keyboard shortcuts" },
  { keys: ["1", "–", "9"], desc: "Jump to tool by sidebar position" },
  { keys: ["⌘", "B"], desc: "Toggle sidebar open/close" },
  { keys: ["⌘", "D"], desc: "Toggle dark / light mode" },
  { keys: ["⌘", ","], desc: "Open settings / profile" },
  { keys: ["⌘", "⇧", "F"], desc: "Favourite the current tool" },
  { keys: ["Esc"], desc: "Close modals / clear search" },
];
