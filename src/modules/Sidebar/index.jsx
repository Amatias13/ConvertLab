import { useState } from "react";
import { REGISTRY, ALL_TOOLS } from "../../data/tools";
import { SIDEBAR_ACTIONS } from "../../constants/tools";
import { useApp } from "../../context/AppContext";
import StarBtn from "../../components/StarBtn";
import "./styles.css";

// Hoisted outside Sidebar — stable reference, no remount on every render
function ToolBtn({ tool, activeTool, setActiveTool }) {
  const active = activeTool === tool.id;
  return (
    <div className={`sidebar-tool-btn${active ? " active" : ""}`} onClick={() => setActiveTool(tool.id)}>
      <span className="sidebar-tool-icon" style={{ background: tool.color + "1a", color: tool.color }}>
        {tool.icon}
      </span>
      <span className="sidebar-tool-label">{tool.label}</span>
      <StarBtn toolId={tool.id} />
    </div>
  );
}

export default function Sidebar({ activeTool, setActiveTool }) {
  const { sidebarOpen, setSidebarOpen, favorites, theme, toggleTheme, setModal } = useApp();
  const [search, setSearch] = useState("");

  const q = search.toLowerCase().trim();
  const favTools = favorites.map((id) => ALL_TOOLS.find((t) => t.id === id)).filter(Boolean);

  const filteredGroups = [
    ...(favTools.length > 0 && !q ? [{ section: "Favorites", items: favTools, isFav: true }] : []),
    ...REGISTRY.map((g) => ({
      ...g,
      items: q ? g.items.filter((t) => t.label.toLowerCase().includes(q) || t.id.includes(q)) : g.items,
    })).filter((g) => g.items.length > 0),
  ];

  const actions = SIDEBAR_ACTIONS.map((a) => ({
    ...a,
    icon: a.key === "theme" ? (theme === "dark" ? "☀️" : "🌙") : a.icon,
    action: a.key === "theme" ? toggleTheme : a.key === "feedback" ? () => setModal("feedback") : a.key === "about" ? () => setModal("about") : () => setModal("coffee"),
  }));

  return (
    <>
      {!sidebarOpen && (
        <button onClick={() => setSidebarOpen(true)} title="Open sidebar" className="sidebar-open-tab">
          ›
        </button>
      )}

      <div className={`sidebar-wrap${sidebarOpen ? "" : " collapsed"}`}>
        {/* Top controls */}
        <div className="sidebar-top">
          <div className="sidebar-search">
            <span className="sidebar-search-icon">⌕</span>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tools…" className="sidebar-search-input" />
            {search && (
              <span onClick={() => setSearch("")} className="sidebar-search-clear">
                ✕
              </span>
            )}
          </div>
          <button onClick={() => setSidebarOpen(false)} title="Collapse sidebar" className="sidebar-collapse-btn">
            ‹
          </button>
        </div>

        {/* Tool list */}
        <div className="sidebar-list">
          {filteredGroups.length === 0 && q && (
            <div className="sidebar-no-results">
              No tools match "<em>{q}</em>"
            </div>
          )}
          {filteredGroups.map((group) => (
            <div key={group.section}>
              <div className={`sidebar-section-label${group.isFav ? " fav" : ""}`}>
                {group.isFav && "★ "}
                {group.section}
              </div>
              {group.items.map((tool) => (
                <ToolBtn key={tool.id + group.section} tool={tool} activeTool={activeTool} setActiveTool={setActiveTool} />
              ))}
            </div>
          ))}
        </div>

        {/* Bottom actions */}
        <div className="sidebar-actions">
          {actions.map(({ icon, title, action }) => (
            <button key={title} onClick={action} title={title} className="sidebar-action-btn">
              {icon}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
