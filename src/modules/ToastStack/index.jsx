import { useApp } from "../../context/AppContext";
import "./styles.css";

export default function ToastStack() {
  const { toasts } = useApp();
  const colors = { info: "var(--accent5)", success: "var(--accent3)", warn: "var(--accent4)", err: "var(--accent2)" };
  return (
    <div className="toast-stack">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="toast"
          style={{
            borderColor: (colors[t.type] || "var(--border2)") + "44",
            borderLeftColor: colors[t.type] || "var(--accent)",
          }}
        >
          {t.msg}
        </div>
      ))}
    </div>
  );
}
