import { useState } from "react";
import { ToolHeader, Btn } from "../components/UI";
import { hexToRgb, rgbToHex, rgbToHsl, hslToHex } from "../helpers/color";
import { useClipboard } from "../hooks/useClipboard";
import { COLOR_PRESETS } from "../constants/tools";
import Section from "../components/Section";
import ColorSwatch from "../components/ColorSwatch";
import { useApp } from "../context/AppContext";

export default function ColorTool() {
  const { copy } = useClipboard();
  const { saveProfile } = useApp();
  const [hex, setHex] = useState("#7c6dff");
  const [hexInput, setHexInput] = useState("#7c6dff");

  const apply = (h) => {
    if (!/^#[0-9a-fA-F]{6}$/.test(h)) return;
    setHex(h);
    setHexInput(h);
  };

  const setAsAccent = () => {
    saveProfile({ paletteIdx: 6, customAccent: hex });
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
    <div className="tool-wrap">
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
        <Btn onClick={setAsAccent} primary>
          Set as App Accent
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
