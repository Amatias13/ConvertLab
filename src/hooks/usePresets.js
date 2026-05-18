import { useCallback } from "react";
import { APP_NAME, APP_VERSION } from "../constants/app";
import { storageSet, storageSetString } from "../utils/storage";
import { STORAGE_KEYS } from "../constants/app";

/**
 * Provides exportPresets / importPresets helpers, extracted from AppContext
 * to keep context lean.
 */
export function usePresets({ profile, theme, favourites, saveProfile, setThemeState, setFavourites, showToast }) {
  const exportPresets = useCallback(() => {
    const data = {
      version: APP_VERSION,
      exportedAt: new Date().toISOString(),
      exportedBy: profile.displayName || `${APP_NAME} User`,
      profile,
      theme,
      favourites,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    Object.assign(document.createElement("a"), {
      href: url,
      download: `${APP_NAME}-presets-${Date.now()}.json`,
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
          if (data.profile) saveProfile(data.profile);
          if (data.theme) {
            setThemeState(data.theme);
            storageSetString(STORAGE_KEYS.THEME, data.theme);
          }
          if (data.favourites) {
            setFavourites(data.favourites);
            storageSet(STORAGE_KEYS.FAVOURITES, data.favourites);
          }
          showToast(`Presets imported from ${data.exportedBy || "file"}!`, "success");
        } catch {
          showToast("Invalid presets file", "err");
        }
      };
      reader.readAsText(file);
    },
    [saveProfile, setThemeState, setFavourites, showToast],
  );

  return { exportPresets, importPresets };
}
