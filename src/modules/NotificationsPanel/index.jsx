import { useApp } from "../../context/AppContext";
import { NOTIFICATION_ICONS } from "../../constants/theme";
import { formatRelativeTime } from "../../helpers/util";
import "./styles.css";

export default function NotificationsPanel({ onClose }) {
  const { notifications, markRead, markAllRead, unreadCount } = useApp();

  return (
    <div className="notif-panel">
      <div className="notif-header">
        <span className="notif-title">Notifications</span>
        {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="notif-mark-all">
            Mark all read
          </button>
        )}
        <button onClick={onClose} className={`notif-close${unreadCount ? "" : " ml-auto"}`}>
          ✕
        </button>
      </div>
      <div className="notif-list">
        {notifications.map((n) => (
          <div key={n.id} onClick={() => markRead(n.id)} className={`notif-item${n.read ? "" : " unread"}`}>
            <span className="notif-item-icon">{NOTIFICATION_ICONS[n.type] || "📌"}</span>
            <div className="notif-item-body">
              <div className="notif-item-row">
                <span className="notif-item-title">{n.title}</span>
                {!n.read && <span className="notif-item-dot" />}
              </div>
              <div className="notif-item-text">{n.body}</div>
              <div className="notif-item-time">{formatRelativeTime(n.time)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
