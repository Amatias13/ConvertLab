import { createContext, useContext, useState, useCallback } from "react";
import { TOAST_DURATION } from "../constants/app";
import { ThemeProvider, useTheme } from "./ThemeContext";
import { ProfileProvider, useProfile } from "./ProfileContext";
import { NotificationsProvider, useNotifications } from "./NotificationsContext";

// Cross-cutting: toasts + modal only
const AppContext = createContext(null);

function ToastModalProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [modal, setModal] = useState(null);

  const showToast = useCallback((msg, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), TOAST_DURATION);
  }, []);

  return <AppContext.Provider value={{ toasts, showToast, modal, setModal }}>{children}</AppContext.Provider>;
}

// Provider order: Notifications > ToastModal > Theme > Profile
// Theme above Profile so ProfileProvider can call useTheme() directly.
// Profile above children so all tools can call useProfile() / useTheme().
export function AppProvider({ children }) {
  return (
    <NotificationsProvider>
      <ToastModalProvider>
        <ThemeProviderWrapper>{children}</ThemeProviderWrapper>
      </ToastModalProvider>
    </NotificationsProvider>
  );
}

// ThemeProviderWrapper: reads nothing from above, just mounts ThemeProvider.
// Profile is nested inside so it can useTheme().
function ThemeProviderWrapper({ children }) {
  return (
    <ThemeProvider>
      <ProfileProviderWrapper>{children}</ProfileProviderWrapper>
    </ThemeProvider>
  );
}

// ProfileProviderWrapper: reads showToast from AppContext (via useContext),
// no prop-drilling needed.
function ProfileProviderWrapper({ children }) {
  const { showToast } = useContext(AppContext);
  return <ProfileProvider showToast={showToast}>{children}</ProfileProvider>;
}

// Unified hook — zero call-site changes
export function useApp() {
  const app = useContext(AppContext);
  const theme = useTheme();
  const profile = useProfile();
  const notifications = useNotifications();
  return { ...app, ...theme, ...profile, ...notifications };
}
