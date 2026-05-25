import "./styles.css";

/**
 * Generic labelled section wrapper with uppercase title and bottom margin.
 * Used in ProfileModal settings tabs and ColorTool.
 *
 * Props:
 *   title    — section heading text
 *   grid     — if true, wraps children in an auto-fill grid (used by ColorTool)
 *   children — section content
 */
export default function Section({ title, children, grid = false }) {
  return (
    <div className="section">
      <div className="section-title">{title}</div>
      {grid ? <div className="section-grid">{children}</div> : children}
    </div>
  );
}
