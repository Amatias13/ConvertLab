import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { DEFAULT_PROFILE, ACCENT_PALETTES, FONT_OPTIONS } from "../constants/theme";
import { persist, hashString } from "../helpers/util";
import { APP_VERSION } from "../constants/app";
import { sanitizeProfile } from "../helpers/profile";
import { darken } from "../helpers/color";
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
    Object.assign(document.createElement("a"), {
      href: url,
      download: `ConvertLab-presets-${Date.now()}.json`,
    }).click();
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
        exportPresets,
        importPresets,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);
