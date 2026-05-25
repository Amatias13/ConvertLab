import React from "react";
import "./styles.css";

/**
 * Generic tab button. Accepts content via children or label prop.
 * Props:
 *   active   — boolean, drives .active CSS class
 *   onClick  — click handler
 *   label    — optional string label (alternative to children)
 *   children — tab content (used when label is not provided)
 */
function Tab({ active, onClick, label, children }) {
  return (
    <button onClick={onClick} className={`tab-button${active ? " active" : ""}`}>
      {label ?? children}
    </button>
  );
}

export default Tab;
