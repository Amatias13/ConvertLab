import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { ALL_TOOLS } from "../../data/tools";
import { GITHUB_URL, DEFAULT_TOOL, APP_NAME } from "../../constants/app";
import Chip from "../../components/Chip";
import NotificationsPanel from "../NotificationsPanel";
import "./styles.css";

export default function Header({ activeTool, setActiveTool, searchOpen, setSearchOpen, searchInputRef }) {
  const { theme, toggleTheme, unreadCount, setModal, profile } = useApp();
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  const toolCount = ALL_TOOLS.length;
  const results = searchVal.trim() ? ALL_TOOLS.filter((t) => t.label.toLowerCase().includes(searchVal.toLowerCase()) || t.id.includes(searchVal.toLowerCase())) : [];

  const clearSearch = () => {
    setSearchVal("");
    setSearchOpen(false);
  };

  const handlePickTool = (id) => {
    setActiveTool(id);
    clearSearch();
  };

  return (
    <>
      <header className="header">
        {/* Logo */}
        <div onClick={() => setActiveTool(DEFAULT_TOOL)} className="header-logo">
          <span className="header-logo-dot" />
          <span className="header-logo-text">{APP_NAME}</span>
        </div>

        {/* Search */}
        <div className="header-search">
          <div onClick={() => setSearchOpen(true)} className={`header-search-box${searchOpen ? " focused" : ""}`}>
            <span className="header-search-icon">⌕</span>
            {searchOpen ? (
              <input
                ref={searchInputRef}
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                onBlur={() => {
                  if (!searchVal) clearSearch();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") clearSearch();
                  if (e.key === "Enter" && results[0]) handlePickTool(results[0].id);
                }}
                placeholder={`Search ${toolCount} tools…`}
                className="header-search-input"
                autoFocus
              />
            ) : (
              <span className="header-search-placeholder">Search {toolCount} tools…</span>
            )}
            <kbd className="header-search-kbd">⌘K</kbd>
          </div>

          {searchOpen && searchVal && (
            <div className="header-search-dropdown">
              {results.length === 0 ? (
                <div className="header-search-empty">
                  No tools match "<em>{searchVal}</em>"
                </div>
              ) : (
                results.slice(0, 8).map((tool) => (
                  <div key={tool.id} onClick={() => handlePickTool(tool.id)} className="header-search-result">
                    <span className="header-search-result-icon" style={{ background: tool.color + "1a", color: tool.color }}>
                      {tool.icon}
                    </span>
                    <span className="header-search-result-label">{tool.label}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Right actions */}
        <div className="header-actions">
          <Chip icon="ℹ️" title="About this tool" onClick={() => setModal("about")} />
          <Chip icon={theme === "dark" ? "☀️" : "🌙"} title="Toggle theme (⌘D)" onClick={toggleTheme} />
          <Chip icon="🔔" title="Notifications" badge={unreadCount} onClick={() => setNotifOpen((v) => !v)} />
          <Chip icon="💬" title="Send feedback" onClick={() => setModal("feedback")} />
          <Chip icon="⚙️" title="Settings (⌘,)" onClick={() => setModal("profile")} />
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" title={`GitHub — ${APP_NAME}`} className="header-github">
            <span>⌥</span> GitHub
          </a>

          {profile.displayName && (
            <div onClick={() => setModal("profile")} title={`Signed in as ${profile.displayName}`} className="header-avatar">
              {profile.displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </header>

      {notifOpen && <NotificationsPanel onClose={() => setNotifOpen(false)} />}
      {notifOpen && <div className="header-notif-backdrop" onClick={() => setNotifOpen(false)} />}
      {searchOpen && !searchVal && <div className="header-search-backdrop" onClick={clearSearch} />}
    </>
  );
}
