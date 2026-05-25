import "./styles.css";

/**
 * Displays a single computed statistic — label, value, optional sub-text and colour.
 * Used in TextStatsTool and any tool that shows calculated metrics.
 */
export default function StatCard({ label, value, sub, color }) {
  return (
    <div className="stat-card">
      <div className="stat-card-label">{label}</div>
      <div className="stat-card-value" style={{ color: color || "var(--text)" }}>
        {value}
      </div>
      {sub && <div className="stat-card-sub">{sub}</div>}
    </div>
  );
}
