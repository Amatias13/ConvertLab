import { useState } from "react";
import "./styles.css";

/**
 * Displays a color swatch with hex value and optional name.
 * Click triggers the onClick callback with the hex value.
 */
export default function ColorSwatch({ hex, name, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="color-swatch" onClick={() => onClick(hex)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ transform: hovered ? "scale(1.03)" : "scale(1)" }}>
      <div className="color-swatch-block" style={{ background: hex }} />
      <div className="color-swatch-info">
        {name && <div className="color-swatch-name">{name}</div>}
        <div className="color-swatch-hex">{hex}</div>
      </div>
    </div>
  );
}
