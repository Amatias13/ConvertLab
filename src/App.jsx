import { useState, useRef, useCallback } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { DEFAULT_TOOL } from "./constants/app";
import Header from "./modules/Header";
import Sidebar from "./modules/Sidebar";
import AboutModal from "./modules/AboutModal";
import FeedbackModal from "./modules/FeedbackModal";
import CoffeeModal from "./modules/CoffeeModal";
import ToastStack from "./modules/ToastStack";
import { ProfileModal } from "./modules/ProfileModal";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import ShortcutsModal from "./modules/ShortcutsModal";
import { TOOL_MAP } from "./features";
import "./App.css";

function AppInner() {
  const [activeTool, setActiveToolState] = useState(DEFAULT_TOOL);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef(null);
  const { recordUsage } = useApp();

  const setActiveTool = useCallback(
    (id) => {
      setActiveToolState(id);
      recordUsage(id);
    },
    [recordUsage],
  );

  const openSearch = useCallback((val) => {
    setSearchOpen(val);
    if (val) setTimeout(() => searchInputRef.current?.focus(), 50);
  }, []);

  useKeyboardShortcuts({ setActiveTool, activeTool, setSearchOpen: openSearch, setShortcutsOpen });

  const ActiveTool = TOOL_MAP[activeTool];
  return (
    <div className="app-shell">
      <Header activeTool={activeTool} setActiveTool={setActiveTool} searchOpen={searchOpen} setSearchOpen={openSearch} searchInputRef={searchInputRef} />
      <div className="app-body">
        <Sidebar activeTool={activeTool} setActiveTool={setActiveTool} />
        <main key={activeTool} className="fade-in app-main">
          {ActiveTool ? <ActiveTool /> : <div className="app-empty">Select a tool from the sidebar</div>}
        </main>
      </div>
      <AboutModal toolId={activeTool} />
      <FeedbackModal />
      <CoffeeModal />
      <ProfileModal />
      <ShortcutsModal open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
      <ToastStack />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
