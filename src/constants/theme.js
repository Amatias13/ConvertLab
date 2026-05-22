/**
 * constants/theme.js — theme and profile configuration data.
 *
 * Includes: accent palettes, font options, default profile shape,
 * initial notifications, icon maps, and colour mappings for toasts
 * and status badges.
 *
 * WHY here: All of these are static data consumed by AppContext,
 * ProfileModal (AppearanceTab), and UI components. Keeping them in
 * constants/ means the context and components stay logic-only.
 */

// ─── Accent Palettes ──────────────────────────────────────────────
export const ACCENT_PALETTES = [
  { name: "Purple", accent: "#7c6dff", accent2: "#ff5f7e", accent3: "#3fe8a0", accent4: "#ffba3b", accent5: "#38b6ff" },
  { name: "Cyan", accent: "#00cec9", accent2: "#fd79a8", accent3: "#55efc4", accent4: "#ffeaa7", accent5: "#74b9ff" },
  { name: "Orange", accent: "#fd9a00", accent2: "#e17055", accent3: "#00b894", accent4: "#ffeaa7", accent5: "#74b9ff" },
  { name: "Rose", accent: "#e84393", accent2: "#a855f7", accent3: "#3fe8a0", accent4: "#fbbf24", accent5: "#60a5fa" },
  { name: "Green", accent: "#10d98a", accent2: "#f97316", accent3: "#38bdf8", accent4: "#fbbf24", accent5: "#a78bfa" },
  { name: "Blue", accent: "#3b82f6", accent2: "#a855f7", accent3: "#10d98a", accent4: "#fbbf24", accent5: "#f472b6" },
  { name: "Custom", accent: "", accent2: "", accent3: "", accent4: "", accent5: "" },
];

// ─── Font Options ─────────────────────────────────────────────────
export const FONT_OPTIONS = [
  { name: "Figtree", value: "'Figtree', sans-serif" },
  { name: "Inter", value: "'Inter', sans-serif" },
  { name: "System", value: "system-ui, sans-serif" },
  { name: "DM Sans", value: "'DM Sans', sans-serif" },
  { name: "Mono", value: "'DM Mono', monospace" },
];

// ─── Default Profile ──────────────────────────────────────────────
export const DEFAULT_PROFILE = {
  displayName: "",
  paletteIdx: 0,
  customAccent: "#7c6dff",
  customAccent2: "#ff5f7e",
  customAccent3: "#3fe8a0",
  fontIdx: 0,
  fontSize: 14,
};

// ─── Initial Notifications ────────────────────────────────────────
export const NOTIFICATIONS_INIT = [
  { id: 1, type: "new", title: "Welcome to ConvertLab!", body: "Built by Andre Matias — free, open-source, 28+ tools.", time: Date.now() - 3600000, read: false },
  { id: 2, type: "new", title: "AI powered by Pollinations", body: "The AI tool uses Pollinations.ai — 100% free, no key needed.", time: Date.now() - 7200000, read: false },
  { id: 3, type: "tip", title: "Favourite your tools", body: "Click the star on any tool to pin it to the sidebar.", time: Date.now() - 86400000, read: false },
  { id: 4, type: "tip", title: "Keyboard shortcuts", body: "Press Cmd+K to search, 1-9 to jump to tools, ? for all shortcuts.", time: Date.now() - 172800000, read: true },
  { id: 5, type: "update", title: "v2.0 launched", body: "PWA, shortcuts, custom themes, profiles, Pollinations AI and more.", time: Date.now() - 259200000, read: true },
];

// ─── Notification Type Icons ──────────────────────────────────────
export const NOTIFICATION_ICONS = {
  new: "🚀",
  tip: "💡",
  update: "📦",
  warn: "⚠️",
};

// ─── Toast colour mapping ─────────────────────────────────────────
export const TOAST_COLORS = {
  info: "var(--accent5)",
  success: "var(--accent3)",
  warn: "var(--accent4)",
  err: "var(--accent2)",
};

// ─── Status badge colour mapping ─────────────────────────────────
export const STATUS_COLORS = {
  ok: "var(--accent3)",
  err: "var(--accent2)",
  warn: "var(--accent4)",
  info: "var(--accent5)",
};

