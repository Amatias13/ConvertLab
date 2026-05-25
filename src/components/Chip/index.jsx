import "./styles.css";

/**
 * Generic icon-button chip with optional text label and notification badge.
 * Used in Header actions bar and anywhere a compact icon-button is needed.
 */
export default function Chip({ icon, title, onClick, badge, label }) {
  return (
    <button onClick={onClick} title={title} className="chip">
      <span>{icon}</span>
      {label && <span className="chip-label">{label}</span>}
      {badge > 0 && <span className="chip-badge" />}
    </button>
  );
}
