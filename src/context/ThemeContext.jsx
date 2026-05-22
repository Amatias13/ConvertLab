import { createContext, useContext, useState, useCallback } from "react";
import { persist } from "../helpers/util";
import { STORAGE_KEYS } from "../constants/app";

const ThemeContext = createContext(null);

// ThemeProvider owns theme state + toggle only.
// CSS variable application (which needs both theme + profile) lives in
// ProfileContext, which mounts below ThemeProvider and calls useTheme().
export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => localStorage.getItem(STORAGE_KEYS.THEME) || "dark");

  const toggleTheme = useCallback(
    () =>
      setThemeState((t) => {
        const next = t === "dark" ? "light" : "dark";
        persist(STORAGE_KEYS.THEME, next);
        return next;
      }),
    [],
  );

  return <ThemeContext.Provider value={{ theme, setThemeState, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
