import { createContext, useContext, useState, useCallback, useRef } from "react";
import { TOAST_DURATION } from "../constants/app";
import { ThemeProvider, useTheme } from "./ThemeContext";
import { ProfileProvider, useProfile } from "./ProfileContext";
import { NotificationsProvider, useNotifications } from "./NotificationsContext";

// Cross-cutting: toasts + modal
const AppContext = createContext(null);

// We need: ThemeProvider wraps everything so profile can read theme state,
// but ProfileProvider needs setThemeState for importPresets.
// Solution: pass a stable ref callback into ProfileProvider that
// ThemeProvider populates once mounted.
function AppCore({ children }) {
  const [toasts, setToasts] = useState([]);
  const [modal, setModal] = useState(null);
  const setThemeRef = useRef(null); // filled by ThemeProvider via onMount

  const showToast = useCallback((msg, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      TOAST_DURATION
    );
  }, []);

  // Stable proxy so ProfileProvider can always call the real setter
  const setThemeState = useCallback((val) => {
    setThemeRef.current?.(val);
  }, []);

  return (
    <AppContext.Provider value={{ toasts, showToast, modal, setModal }}>
      <ProfileProvider showToast={showToast} setThemeState={setThemeState}>
        <ThemeProviderBridge setThemeRef={setThemeRef}>
          {children}
        </ThemeProviderBridge>
      </ProfileProvider>
    </AppContext.Provider>
  );
}

// Mounts ThemeProvider; registers its setter into the ref
function ThemeProviderBridge({ setThemeRef, children }) {
  const { profile } = useProfile();
  return (
    <ThemeProvider profile={profile} onSetTheme={(fn) => { setThemeRef.current = fn; }}>
      {children}
    </ThemeProvider>
  );
}

export function AppProvider({ children }) {
  return (
    <NotificationsProvider>
      <AppCore>{children}</AppCore>
    </NotificationsProvider>
  );
}

// Unified hook — zero call-site changes needed
export function useApp() {
  const app = useContext(AppContext);
  const theme = useTheme();
  const profile = useProfile();
  const notifications = useNotifications();
  return { ...app, ...theme, ...profile, ...notifications };
}
