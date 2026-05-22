import { useApp } from "../context/AppContext";

export default function NotificationsPanel({ onClose }) {
  const { notifications, markRead, markAllRead, unreadCount } = useApp();
  const icons = { new: "🚀", tip: "💡", update: "📦", warn: "⚠️" };
  const relTime = (ts) => {
    const d = (Date.now() - ts) / 1000;
    if (d < 60) return "just now";
    if (d < 3600) return Math.round(d / 60) + "m ago";
    if (d < 86400) return Math.round(d / 3600) + "h ago";
    return Math.round(d / 86400) + "d ago";
  };
  return (
    <div style={{ position: "fixed", top: 54, right: 12, width: 340, background: "var(--bg2)", border: "1px solid var(--border2)", borderRadius: 14, boxShadow: "var(--shadow)", zIndex: 150, overflow: "hidden", animation: "slideUp 0.2s ease" }}>
      <div style={{ padding: "0.85rem 1rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span style={{ fontWeight: 700, fontSize: 13 }}>Notifications</span>
        {unreadCount > 0 && <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 100, background: "var(--accent)", color: "#fff" }}>{unreadCount}</span>}
        {unreadCount > 0 && (
          <button onClick={markAllRead} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "var(--accent5)", fontFamily: "var(--sans)" }}>
            Mark all read
          </button>
        )}
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text3)", fontSize: 16, marginLeft: unreadCount ? 0 : "auto" }}>
          ✕
        </button>
      </div>
      <div style={{ maxHeight: 380, overflowY: "auto" }}>
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => markRead(n.id)}
            style={{ padding: "0.85rem 1rem", borderBottom: "1px solid var(--border)", cursor: "pointer", background: n.read ? "transparent" : "rgba(124,109,255,0.05)", display: "flex", gap: "0.75rem", alignItems: "flex-start", transition: "background 0.15s" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg3)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = n.read ? "transparent" : "rgba(124,109,255,0.05)")}
          >
            <span style={{ fontSize: "1.1rem", flexShrink: 0, marginTop: 1 }}>{icons[n.type] || "📌"}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span style={{ fontWeight: 600, fontSize: 12.5, color: "var(--text)" }}>{n.title}</span>
                {!n.read && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} />}
              </div>
              <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 2, lineHeight: 1.5 }}>{n.body}</div>
              <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 4 }}>{relTime(n.time)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
