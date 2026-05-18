import { useState } from "react";
import { ToolHeader, Btn } from "../components/UI";
import { hexToRgb, rgbToHex, rgbToHsl, hslToHex } from "../helpers/color";
import { useApp } from "../context/AppContext";
import { useClipboard } from "../hooks/useClipboard";
import { COLOR_PRESETS } from "../constants/tools";

function ColorSwatch({ hex, name, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onClick={() => onClick(hex)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ borderRadius: 10, overflow: "hidden", border: "1px solid var(--border)", cursor: "pointer", transform: hovered ? "scale(1.03)" : "scale(1)", transition: "transform 0.15s" }}>
      <div style={{ height: 64, background: hex }} />
      <div style={{ padding: "0.5rem 0.7rem", background: "var(--bg2)" }}>
        {name && <div style={{ fontSize: 11, fontWeight: 500, color: "var(--text)" }}>{name}</div>}
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)" }}>{hex}</div>
      </div>
    </div>
  );
}

const Section = ({ title, children }) => (
  <div style={{ marginBottom: "1.5rem" }}>
    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text3)", marginBottom: "0.75rem" }}>{title}</div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(110px,1fr))", gap: 10 }}>{children}</div>
  </div>
);

export default function ColorTool() {
  const { showToast } = useApp();
  const { copy } = useClipboard();
  const [hex, setHex] = useState("#7c6dff");
  const [hexInput, setHexInput] = useState("#7c6dff");

  const apply = (h) => {
    if (!/^#[0-9a-fA-F]{6}$/.test(h)) return;
    setHex(h);
    setHexInput(h);
  };

  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const shades = Array.from({ length: 9 }, (_, i) => {
    const t = i / 8;
    return rgbToHex(Math.round(rgb.r + (255 - rgb.r) * t * 0.85), Math.round(rgb.g + (255 - rgb.g) * t * 0.85), Math.round(rgb.b + (255 - rgb.b) * t * 0.85));
  });
  const darks = Array.from({ length: 5 }, (_, i) => {
    const f = 1 - (i + 1) * 0.15;
    return rgbToHex(Math.round(rgb.r * f), Math.round(rgb.g * f), Math.round(rgb.b * f));
  });
  const palette = [
    { name: "Complement", hex: hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l) },
    { name: "Split 1", hex: hslToHex((hsl.h + 150) % 360, hsl.s, hsl.l) },
    { name: "Split 2", hex: hslToHex((hsl.h + 210) % 360, hsl.s, hsl.l) },
    { name: "Triadic 1", hex: hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l) },
    { name: "Triadic 2", hex: hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l) },
    { name: "Analogous +", hex: hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l) },
    { name: "Analogous −", hex: hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l) },
    { name: "Analogous 2", hex: hslToHex((hsl.h + 60) % 360, hsl.s, hsl.l) },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
      <ToolHeader title="Color Picker & Converter" desc="Convert between HEX, RGB, HSL and explore palettes" />
      <div style={{ padding: "0.6rem 1rem", borderBottom: "1px solid var(--border)", display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
        <input type="color" value={hex} onChange={(e) => apply(e.target.value)} style={{ width: 36, height: 30, border: "none", background: "none", cursor: "pointer", padding: 0, borderRadius: 6 }} />
        <input
          type="text"
          value={hexInput}
          onChange={(e) => {
            setHexInput(e.target.value);
            apply(e.target.value);
          }}
          style={{ width: 90, fontFamily: "var(--mono)", fontSize: 13 }}
        />
        <span style={{ fontSize: 12, color: "var(--text3)" }}>
          rgb({rgb.r}, {rgb.g}, {rgb.b})
        </span>
        <span style={{ fontSize: 12, color: "var(--text3)" }}>
          hsl({Math.round(hsl.h)}°, {Math.round(hsl.s)}%, {Math.round(hsl.l)}%)
        </span>
        <Btn
          style={{ marginLeft: "auto" }}
          onClick={() => {
            copy(hex, "Copied: " + hex);
          }}
        >
          Copy HEX
        </Btn>
        <Btn
          onClick={() => {
            copy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, "Copied RGB");
          }}
        >
          Copy RGB
        </Btn>
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: "1.25rem" }}>
        <Section title="Shades & Tints">
          {[...shades, ...darks].map((h, i) => (
            <ColorSwatch key={i} hex={h} onClick={apply} />
          ))}
        </Section>
        <Section title="Complementary Palette">
          {palette.map((p, i) => (
            <ColorSwatch key={i} hex={p.hex} name={p.name} onClick={apply} />
          ))}
        </Section>
        <Section title="Preset Swatches">
          {COLOR_PRESETS.map((p, i) => (
            <ColorSwatch key={i} hex={p.hex} name={p.name} onClick={apply} />
          ))}
        </Section>
      </div>
    </div>
  );
}
