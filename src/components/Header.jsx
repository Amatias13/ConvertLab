import { useState } from "react";
import { useApp } from "../context/AppContext";
import { ALL_TOOLS } from "../data/tools";
import NotificationsPanel from "./NotificationsPanel";

export default function Header({ activeTool, setActiveTool, searchOpen, setSearchOpen, searchInputRef }) {
  const { theme, toggleTheme, unreadCount, setModal, profile } = useApp();
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  const results = searchVal.trim() ? ALL_TOOLS.filter((t) => t.label.toLowerCase().includes(searchVal.toLowerCase()) || t.id.includes(searchVal.toLowerCase())) : [];

  const clearSearch = () => {
    setSearchVal("");
    setSearchOpen(false);
  };

  const handlePickTool = (id) => {
    setActiveTool(id);
    clearSearch();
  };

  const Chip = ({ icon, title, onClick, badge, label }) => (
    <button
      onClick={onClick}
      title={title}
      style={{
        height: 34,
        padding: "0 10px",
        borderRadius: 9,
        border: "1px solid var(--border)",
        background: "transparent",
        color: "var(--text2)",
        fontSize: 13,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 5,
        position: "relative",
        transition: "all 0.15s",
        flexShrink: 0,
        fontFamily: "var(--sans)",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--bg3)";
        e.currentTarget.style.color = "var(--text)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "var(--text2)";
      }}
    >
      <span>{icon}</span>
      {label && <span style={{ fontSize: 12 }}>{label}</span>}
      {badge > 0 && <span style={{ position: "absolute", top: 5, right: 5, width: 7, height: 7, borderRadius: "50%", background: "var(--accent2)", border: "1.5px solid var(--bg)" }} />}
    </button>
  );

  return (
    <>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          padding: "0 0.85rem",
          height: 52,
          borderBottom: "1px solid var(--border)",
          background: "var(--bg-glass)",
          backdropFilter: "blur(14px)",
          flexShrink: 0,
          zIndex: 100,
          gap: "0.5rem",
        }}
      >
        {/* Logo */}
        <div onClick={() => setActiveTool("json")} style={{ display: "flex", alignItems: "center", gap: "0.45rem", cursor: "pointer", flexShrink: 0, marginRight: "0.25rem" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 10px var(--accent)", display: "inline-block", animation: "pulse 2s ease-in-out infinite" }} />
          <span style={{ fontFamily: "var(--display)", fontSize: "1.1rem", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--text)" }}>ConvertLab</span>
        </div>

        {/* Search */}
        <div style={{ flex: 1, maxWidth: 360, position: "relative" }}>
          <div
            onClick={() => setSearchOpen(true)}
            style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "var(--bg3)", border: `1px solid ${searchOpen ? "var(--accent)" : "var(--border2)"}`, borderRadius: 9, padding: "0.28rem 0.75rem", cursor: "text", height: 32, transition: "border-color 0.15s" }}
          >
            <span style={{ color: "var(--text3)", fontSize: 12, flexShrink: 0 }}>⌕</span>
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
                placeholder="Search 28 tools…"
                style={{ background: "none", border: "none", outline: "none", fontFamily: "var(--sans)", fontSize: 12.5, color: "var(--text)", flex: 1, padding: 0, width: "100%" }}
                autoFocus
              />
            ) : (
              <span style={{ fontSize: 12.5, color: "var(--text3)", flex: 1 }}>Search 28 tools…</span>
            )}
            <kbd style={{ fontSize: 9, color: "var(--text3)", background: "var(--bg4)", border: "1px solid var(--border2)", borderRadius: 4, padding: "1px 5px", fontFamily: "var(--mono)", flexShrink: 0 }}>⌘K</kbd>
          </div>

          {/* Dropdown results */}
          {searchOpen && searchVal && (
            <div style={{ position: "absolute", top: "100%", left: 0, right: 0, marginTop: 5, background: "var(--bg2)", border: "1px solid var(--border2)", borderRadius: 12, boxShadow: "var(--shadow)", zIndex: 200, overflow: "hidden", animation: "slideUp 0.15s ease" }}>
              {results.length === 0 ? (
                <div style={{ padding: "0.85rem 1rem", fontSize: 12.5, color: "var(--text3)" }}>
                  No tools match "<em>{searchVal}</em>"
                </div>
              ) : (
                results.slice(0, 8).map((tool) => (
                  <div
                    key={tool.id}
                    onClick={() => handlePickTool(tool.id)}
                    style={{ display: "flex", alignItems: "center", gap: "0.7rem", padding: "0.55rem 0.9rem", cursor: "pointer", transition: "background 0.1s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg3)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <span style={{ width: 24, height: 24, borderRadius: 7, background: tool.color + "1a", color: tool.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{tool.icon}</span>
                    <span style={{ fontSize: 13, color: "var(--text)" }}>{tool.label}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Right actions */}
        <div style={{ marginLeft: "auto", display: "flex", gap: "0.3rem", alignItems: "center" }}>
          <Chip icon="ℹ️" title="About this tool" onClick={() => setModal("about")} />
          <Chip icon={theme === "dark" ? "☀️" : "🌙"} title="Toggle theme (⌘D)" onClick={toggleTheme} />
          <Chip icon="🔔" title="Notifications" badge={unreadCount} onClick={() => setNotifOpen((v) => !v)} />
          <Chip icon="💬" title="Send feedback" onClick={() => setModal("feedback")} />
          <Chip icon="⚙️" title="Settings (⌘,)" onClick={() => setModal("profile")} />
          <a
            href="https://github.com/Amatias13/ConvertLab"
            target="_blank"
            rel="noreferrer"
            title="GitHub — Amatias13/ConvertLab"
            style={{
              height: 34,
              padding: "0 10px",
              borderRadius: 9,
              border: "1px solid var(--border)",
              background: "transparent",
              color: "var(--text3)",
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              gap: 4,
              textDecoration: "none",
              transition: "all 0.15s",
              flexShrink: 0,
              fontFamily: "var(--sans)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--bg3)";
              e.currentTarget.style.color = "var(--text)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--text3)";
            }}
          >
            <span>⌥</span> GitHub
          </a>

          {/* Avatar / profile initial */}
          {profile.displayName && (
            <div
              onClick={() => setModal("profile")}
              title={`Signed in as ${profile.displayName}`}
              style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,var(--accent),var(--accent2))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", flexShrink: 0 }}
            >
              {profile.displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </header>

      {/* Notifications */}
      {notifOpen && <NotificationsPanel onClose={() => setNotifOpen(false)} />}
      {notifOpen && <div style={{ position: "fixed", inset: 0, zIndex: 140 }} onClick={() => setNotifOpen(false)} />}
      {/* Search backdrop */}
      {searchOpen && !searchVal && <div style={{ position: "fixed", inset: 0, zIndex: 99 }} onClick={clearSearch} />}
    </>
  );
}
