import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { ACCENT_PALETTES, FONT_OPTIONS } from "../constants/theme";
import { persist } from "../helpers/util";
import { darken } from "../helpers/color";
import { STORAGE_KEYS } from "../constants/app";

const ThemeContext = createContext(null);

export function ThemeProvider({ children, profile, onSetTheme }) {
  const [theme, setThemeState] = useState(() => localStorage.getItem(STORAGE_KEYS.THEME) || "dark");

  // Register setter with parent bridge so ProfileProvider can drive theme on import
  // Called once on mount; stable ref pattern — no re-render triggered
  useEffect(() => {
    onSetTheme?.(setThemeState);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Apply theme + accent palette to CSS variables
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    persist(STORAGE_KEYS.THEME, theme);
    const pal = ACCENT_PALETTES[profile.paletteIdx] || ACCENT_PALETTES[0];
    const isCustom = pal.name === "Custom";
    const factor = theme === "light" ? 20 : 0;
    const applyAccent = (key, val) => {
      if (!val) return;
      root.style.setProperty(key, factor ? darken(val, factor) : val);
    };
    if (isCustom) {
      applyAccent("--accent", profile.customAccent);
      applyAccent("--accent2", profile.customAccent2);
      applyAccent("--accent3", profile.customAccent3);
    } else {
      applyAccent("--accent", pal.accent);
      applyAccent("--accent2", pal.accent2);
      applyAccent("--accent3", pal.accent3);
      applyAccent("--accent4", pal.accent4);
      applyAccent("--accent5", pal.accent5);
    }
  }, [theme, profile.paletteIdx, profile.customAccent, profile.customAccent2, profile.customAccent3]);

  // Apply font family + size
  useEffect(() => {
    document.documentElement.style.setProperty("--sans", FONT_OPTIONS[profile.fontIdx]?.value || FONT_OPTIONS[0].value);
    document.body.style.fontSize = (profile.fontSize || 14) + "px";
  }, [profile.fontIdx, profile.fontSize]);

  const toggleTheme = useCallback(() => setThemeState((t) => (t === "dark" ? "light" : "dark")), []);

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
