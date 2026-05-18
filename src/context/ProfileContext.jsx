import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { DEFAULT_PROFILE } from "../constants/theme";
import { persist, hashString, sanitizeProfile } from "../helpers/util";
import { STORAGE_KEYS } from "../constants/app";

const ProfileContext = createContext(null);

export function ProfileProvider({ children, showToast, theme, setThemeState }) {
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

  const [favourites, setFavourites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVOURITES) || "[]");
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
    setFavourites((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      persist(STORAGE_KEYS.FAVOURITES, next);
      return next;
    });
  }, []);

  const recordUsage = useCallback((toolId) => {
    setHistory((prev) => {
      const existing = prev.find((h) => h.id === toolId);
      const next = existing
        ? prev.map((h) => (h.id === toolId ? { ...h, count: h.count + 1, lastUsed: Date.now() } : h))
        : [
            ...prev,
            {
              id: toolId,
              count: 1,
              lastUsed: Date.now(),
              firstUsed: Date.now(),
            },
          ];
      const sorted = [...next].sort((a, b) => b.count - a.count);
      persist(STORAGE_KEYS.HISTORY, sorted);
      return sorted;
    });
  }, []);

  const exportPresets = useCallback(() => {
    const data = {
      version: "2.0",
      exportedAt: new Date().toISOString(),
      exportedBy: profile.displayName || "ConvertLab User",
      profile,
      theme,
      favourites,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    Object.assign(document.createElement("a"), {
      href: url,
      download: `ConvertLab-presets-${Date.now()}.json`,
    }).click();
    URL.revokeObjectURL(url);
    showToast("Presets exported!", "success");
  }, [profile, theme, favourites, showToast]);

  const importPresets = useCallback(
    (file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.profile) saveProfile(sanitizeProfile(data.profile));
          if (data.theme && (data.theme === "dark" || data.theme === "light")) {
            setThemeState(data.theme);
            persist(STORAGE_KEYS.THEME, data.theme);
          }
          if (Array.isArray(data.favourites)) {
            setFavourites(data.favourites);
            persist(STORAGE_KEYS.FAVOURITES, data.favourites);
          }
          showToast("Presets imported from " + (data.exportedBy || "file") + "!", "success");
        } catch {
          showToast("Invalid presets file", "err");
        }
      };
      reader.readAsText(file);
    },
    [saveProfile, showToast, setThemeState],
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
        favourites,
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
