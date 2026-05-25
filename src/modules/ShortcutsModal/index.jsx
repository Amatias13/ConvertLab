import { SHORTCUTS } from "../../constants/app";
import Kbd from "../../components/Kbd";
import "./styles.css";

export default function ShortcutsModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box shortcuts-modal" onClick={(e) => e.stopPropagation()}>
        <div className="shortcuts-header">
          <span className="shortcuts-title">⌨️ Keyboard Shortcuts</span>
          <button onClick={onClose} className="shortcuts-close">
            ✕
          </button>
        </div>
        <div className="shortcuts-body">
          {SHORTCUTS.map((s, i) => (
            <div key={i} className={`shortcuts-row${i % 2 === 0 ? " alt" : ""}`}>
              <span className="shortcuts-desc">{s.desc}</span>
              <div className="shortcuts-keys">
                {s.keys.map((k, j) => (
                  <span key={j} className="shortcuts-key-group">
                    {j > 0 && k !== "–" && <span className="shortcuts-plus">+</span>}
                    {k === "–" ? <span className="shortcuts-dash">–</span> : <Kbd>{k}</Kbd>}
                  </span>
                ))}
              </div>
            </div>
          ))}
          <div className="shortcuts-hint">
            💡 Press <Kbd>?</Kbd> anytime to toggle this panel. Press <Kbd>Esc</Kbd> to dismiss any modal.
          </div>
        </div>
      </div>
    </div>
  );
}
