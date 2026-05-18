import React from "react";
import "./styles.css";

/**
 * A simple component that displays a tip with a lightbulb icon. Expects a string as the `tips` prop.
 * Example usage:
 * <Tips tips="Use this tool to quickly generate content ideas." />
 * This would render:
 * 💡 Use this tool to quickly generate content ideas.
 */
function Tips({ tips }) {
  if (!tips) return null;

  return (
    <div className="tipsContainer">
      <span className="tipsIcon">💡</span>
      <p className="tips">{tips}</p>
    </div>
  );
}

export default Tips;
