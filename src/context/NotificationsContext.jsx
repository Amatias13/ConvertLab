import { createContext, useContext, useState, useCallback } from "react";
import { NOTIFICATIONS_INIT } from "../constants/theme";
import { persist } from "../helpers/util";
import { STORAGE_KEYS } from "../constants/app";

const NotificationsContext = createContext(null);

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || "null") || NOTIFICATIONS_INIT;
    } catch {
      return NOTIFICATIONS_INIT;
    }
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = useCallback((id) => {
    setNotifications((prev) => {
      const n = prev.map((x) => (x.id === id ? { ...x, read: true } : x));
      persist(STORAGE_KEYS.NOTIFICATIONS, n);
      return n;
    });
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => {
      const n = prev.map((x) => ({ ...x, read: true }));
      persist(STORAGE_KEYS.NOTIFICATIONS, n);
      return n;
    });
  }, []);

  const addNotification = useCallback((notif) => {
    setNotifications((prev) => {
      const n = [{ id: Date.now(), read: false, time: Date.now(), ...notif }, ...prev];
      persist(STORAGE_KEYS.NOTIFICATIONS, n);
      return n;
    });
  }, []);

  return <NotificationsContext.Provider value={{ notifications, unreadCount, markRead, markAllRead, addNotification }}>{children}</NotificationsContext.Provider>;
}

export const useNotifications = () => useContext(NotificationsContext);
