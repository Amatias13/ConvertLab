import { useEffect } from "react";
import { useApp } from "../context/AppContext";
import { ALL_TOOLS } from "../data/tools";

export function useKeyboardShortcuts({ setActiveTool, activeTool, setSearchOpen, setShortcutsOpen }) {
  const { toggleTheme, setSidebarOpen, setModal, toggleFav, showToast } = useApp();

  useEffect(() => {
    const handler = (e) => {
      const tag = document.activeElement?.tagName;
      const isTyping = ["INPUT", "TEXTAREA", "SELECT"].includes(tag);

      if (e.key === "Escape") {
        setShortcutsOpen(false);
        setModal(null);
        return;
      }

      if (e.key === "?" && !isTyping) {
        e.preventDefault();
        setShortcutsOpen((v) => !v);
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault();
        setSidebarOpen((v) => !v);
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key === "d") {
        e.preventDefault();
        toggleTheme();
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key === ",") {
        e.preventDefault();
        setModal("profile");
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "f") {
        e.preventDefault();
        if (activeTool) {
          toggleFav(activeTool);
          const tool = ALL_TOOLS.find((t) => t.id === activeTool);
          showToast((tool?.label || activeTool) + " favourited ★", "success");
        }
        return;
      }

      if (!isTyping && !e.metaKey && !e.ctrlKey && !e.altKey && e.key >= "1" && e.key <= "9") {
        const idx = parseInt(e.key) - 1;
        if (idx < ALL_TOOLS.length) setActiveTool(ALL_TOOLS[idx].id);
        return;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeTool, toggleTheme, setSidebarOpen, setModal, toggleFav, showToast, setSearchOpen, setShortcutsOpen, setActiveTool]);
}
