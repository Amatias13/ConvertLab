import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { DEFAULT_PROFILE, ACCENT_PALETTES, FONT_OPTIONS } from "../constants/theme";
import { persist, hashString } from "../helpers/util";
import { APP_VERSION } from "../constants/app";
import { sanitizeProfile } from "../helpers/profile";
import { STORAGE_KEYS } from "../constants/app";
import { useTheme } from "./ThemeContext";

const ProfileContext = createContext(null);

export function ProfileProvider({ children, showToast }) {
  const { theme, setThemeState } = useTheme();

  const [profile, setProfileState] = useState(() => {
    try {
      return sanitizeProfile({
        ...DEFAULT_PROFILE,
        ...JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILE) || "{}"),
      });
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [profileHash, setProfileHash] = useState(() => localStorage.getItem(STORAGE_KEYS.PROFILE_HASH) || "");
  const [sidebarOpen, setSidebarOpen] = useState(() => localStorage.getItem(STORAGE_KEYS.SIDEBAR) !== "false");
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES) || "[]");
    } catch {
      return [];
    }
  });
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || "[]");
    } catch {
      return [];
    }
  });

  // ── Apply theme + accent palette to CSS variables ──────────────
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    const pal = ACCENT_PALETTES[profile.paletteIdx] || ACCENT_PALETTES[0];
    const isCustom = pal.name === "Custom";
    const applyAccent = (key, val) => {
      if (!val) return;
      root.style.setProperty(key, val);
    };
    const hexToRgb = (hex) => {
      const n = parseInt(hex.replace("#",""), 16);
      return [(n>>16)&255, (n>>8)&255, n&255];
    };
    const mixColor = (hex, base, amount) => {
      try {
        const [ar,ag,ab] = hexToRgb(hex);
        const [br,bg,bb] = hexToRgb(base);
        const t = amount / 100;
        const r = Math.round(ar*t + br*(1-t));
        const g = Math.round(ag*t + bg*(1-t));
        const b = Math.round(ab*t + bb*(1-t));
        return `#${[r,g,b].map(v=>v.toString(16).padStart(2,"0")).join("")}`;
      } catch { return base; }
    };
    const applyTint = (accent) => {
      const isDark = theme === "dark";
      const base3 = isDark ? "#18181f" : "#e8e8f2";
      const base4 = isDark ? "#21212c" : "#dcdcec";
      root.style.setProperty("--bg3", mixColor(accent, base3, 8));
      root.style.setProperty("--bg4", mixColor(accent, base4, 12));
    };
    if (isCustom) {
      applyAccent("--accent", profile.customAccent);
      applyAccent("--accent2", profile.customAccent2);
      applyAccent("--accent3", profile.customAccent3);
      applyAccent("--accent4", "#ffba3b");
      applyAccent("--accent5", "#38b6ff");
      applyTint(profile.customAccent || "#7c6dff");
    } else {
      applyAccent("--accent", pal.accent);
      applyAccent("--accent2", pal.accent2);
      applyAccent("--accent3", pal.accent3);
      applyAccent("--accent4", pal.accent4);
      applyAccent("--accent5", pal.accent5);
      applyTint(pal.accent);
    }
  }, [theme, profile.paletteIdx, profile.customAccent, profile.customAccent2, profile.customAccent3]);

  // ── Apply font family + size ───────────────────────────────────
  useEffect(() => {
    document.documentElement.style.setProperty("--sans", FONT_OPTIONS[profile.fontIdx]?.value || FONT_OPTIONS[0].value);
    document.body.style.fontSize = (profile.fontSize || 14) + "px";
  }, [profile.fontIdx, profile.fontSize]);

  useEffect(() => {
    persist(STORAGE_KEYS.SIDEBAR, sidebarOpen);
  }, [sidebarOpen]);

  const saveProfile = useCallback((updates) => {
    setProfileState((prev) => {
      const next = { ...prev, ...updates };
      persist(STORAGE_KEYS.PROFILE, next);
      return next;
    });
  }, []);

  const setPassword = useCallback(async (pwd) => {
    const h = await hashString(pwd);
    setProfileHash(h);
    persist(STORAGE_KEYS.PROFILE_HASH, h);
  }, []);

  const checkPassword = useCallback(
    async (pwd) => {
      const h = await hashString(pwd);
      return h === profileHash;
    },
    [profileHash],
  );

  const toggleFav = useCallback((id) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      persist(STORAGE_KEYS.FAVORITES, next);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    persist(STORAGE_KEYS.HISTORY, []);
  }, []);

  const recordUsage = useCallback((toolId) => {
    setHistory((prev) => {
      const existing = prev.find((h) => h.id === toolId);
      const next = existing ? prev.map((h) => (h.id === toolId ? { ...h, count: h.count + 1, lastUsed: Date.now() } : h)) : [...prev, { id: toolId, count: 1, lastUsed: Date.now(), firstUsed: Date.now() }];
      const sorted = [...next].sort((a, b) => b.count - a.count);
      persist(STORAGE_KEYS.HISTORY, sorted);
      return sorted;
    });
  }, []);

  const exportPresets = useCallback(() => {
    const data = {
      version: APP_VERSION,
      exportedAt: new Date().toISOString(),
      exportedBy: profile.displayName || "ConvertLab User",
      profile,
      theme, // ← now correctly reads from useTheme()
      favorites,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), {
      href: url,
      download: `ConvertLab-presets-${Date.now()}.json`,
    });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Presets exported!", "success");
  }, [profile, theme, favorites, showToast]);

  const importPresets = useCallback(
    (file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.profile) saveProfile(sanitizeProfile(data.profile));
          if (data.theme === "dark" || data.theme === "light") {
            setThemeState(data.theme); // ← calls useTheme()'s setter directly
          }
          if (Array.isArray(data.favorites)) {
            setFavorites(data.favorites);
            persist(STORAGE_KEYS.FAVORITES, data.favorites);
          }
          showToast("Presets imported from " + (data.exportedBy || "file") + "!", "success");
        } catch {
          showToast("Invalid presets file", "err");
        }
      };
      reader.readAsText(file);
    },
    [saveProfile, setThemeState, showToast],
  );

  return (
    <ProfileContext.Provider
      value={{
        profile,
        saveProfile,
        setPassword,
        checkPassword,
        profileHash,
        sidebarOpen,
        setSidebarOpen,
        favorites,
        toggleFav,
        history,
        recordUsage,
        clearHistory,
        exportPresets,
        importPresets,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);
