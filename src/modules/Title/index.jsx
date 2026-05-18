import React from "react";
import "./styles.css";

/**
 * Component to display the title section of the About Modal for a tool, including the icon, title, and tagline.
 *
 * Props:
 * - icon: The icon representing the tool.
 * - title: The name of the tool.
 * - tagline: A brief description or tagline for the tool.
 * Example usage:
 * <Title
 *  icon={<SomeIcon />}
 *  title="Tool Name"
 *  tagline="A brief description of the tool."
 * />
 */
function Title({ icon, title, tagline, color }) {
  return (
    <div className="title-container">
      <div className="title-icon" style={{ background: color + "1a", color: color }}>
        {icon}
      </div>
      <div>
        <h2 className="title-header">{title}</h2>
        <p className="title-tagline">{tagline}</p>
      </div>
    </div>
  );
}

export default Title;
