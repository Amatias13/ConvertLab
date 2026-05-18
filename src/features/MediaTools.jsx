import { useState, useRef, useEffect, useCallback } from "react";
import { ToolHeader, Panels, Panel0, Panel, PanelLabel, OptionsBar, OptLabel, OptGroup, OptBtn, Btn } from "../components/UI";
import { useApp } from "../context/AppContext";
import { useClipboard } from "../hooks/useClipboard";

// ─── Image Tools ──────────────────────────────────────────────────
export function ImageTool() {
  const { showToast } = useApp();
  const { copy } = useClipboard();
  const [img, setImg] = useState(null); // { src, width, height, name }
  const [filter, setFilter] = useState("none");
  const [format, setFormat] = useState("image/png");
  const [drag, setDrag] = useState(false);
  const canvasRef = useRef(null);
  const fileRef = useRef(null);

  const load = (file) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const image = new Image();
      image.onload = () => setImg({ src: ev.target.result, el: image, width: image.naturalWidth, height: image.naturalHeight, name: file.name, size: file.size });
      image.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!img || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.filter = { none: "none", grayscale: "grayscale(100%)", sepia: "sepia(100%)", invert: "invert(100%)", blur: "blur(3px)", brightness: "brightness(1.4)", contrast: "contrast(1.5)" }[filter];
    ctx.drawImage(img.el, 0, 0);
  }, [img, filter]);

  const download = () => {
    if (!canvasRef.current) return;
    const a = document.createElement("a");
    a.href = canvasRef.current.toDataURL(format, 0.92);
    a.download = "ConvertLab." + format.split("/")[1];
    a.click();
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f) load(f);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
      <ToolHeader title="Image Tools" desc="Convert, filter and transform images in the browser">
        {img && (
          <>
            <Btn onClick={() => setImg(null)}>Reset</Btn>
            <Btn primary onClick={download}>
              Download
            </Btn>
          </>
        )}
      </ToolHeader>

      {img && (
        <OptionsBar>
          <OptLabel>Convert to:</OptLabel>
          <OptGroup>
            {[
              ["image/png", "PNG"],
              ["image/jpeg", "JPEG"],
              ["image/webp", "WebP"],
            ].map(([v, l]) => (
              <OptBtn key={v} active={format === v} onClick={() => setFormat(v)}>
                {l}
              </OptBtn>
            ))}
          </OptGroup>
          <OptLabel style={{ marginLeft: "0.75rem" }}>Filter:</OptLabel>
          <OptGroup>
            {[
              ["none", "None"],
              ["grayscale", "Grayscale"],
              ["sepia", "Sepia"],
              ["invert", "Invert"],
              ["blur", "Blur"],
              ["brightness", "Bright"],
              ["contrast", "Contrast"],
            ].map(([v, l]) => (
              <OptBtn key={v} active={filter === v} onClick={() => setFilter(v)}>
                {l}
              </OptBtn>
            ))}
          </OptGroup>
          <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--text3)" }}>
            {img.width}×{img.height} · {(img.size / 1024).toFixed(1)}KB
          </span>
        </OptionsBar>
      )}

      {!img ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
          <div
            onClick={() => fileRef.current.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDrag(true);
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={onDrop}
            style={{
              border: `1.5px dashed ${drag ? "var(--accent)" : "var(--border2)"}`,
              borderRadius: 16,
              padding: "3rem 5rem",
              textAlign: "center",
              cursor: "pointer",
              color: drag ? "var(--text2)" : "var(--text3)",
              background: drag ? "rgba(124,109,255,0.04)" : "transparent",
              transition: "all 0.2s",
            }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>⊞</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text2)", marginBottom: 4 }}>Drop image here or click to browse</div>
            <div style={{ fontSize: 12 }}>PNG, JPEG, WebP, GIF, SVG supported</div>
          </div>
          <input
            type="file"
            ref={fileRef}
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              if (e.target.files[0]) load(e.target.files[0]);
            }}
          />
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", gap: "1rem", padding: "1rem", overflow: "auto" }}>
          {[
            { label: "Original", content: <img src={img.src} alt="original" style={{ width: "100%", flex: 1, objectFit: "contain", background: "repeating-conic-gradient(var(--bg3) 0% 25%,var(--bg2) 0% 50%) 0 0/20px 20px" }} /> },
            { label: "Result", content: <canvas ref={canvasRef} style={{ width: "100%", flex: 1, objectFit: "contain", background: "repeating-conic-gradient(var(--bg3) 0% 25%,var(--bg2) 0% 50%) 0 0/20px 20px" }} /> },
          ].map(({ label, content }) => (
            <div key={label} style={{ flex: 1, border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "0.4rem 0.85rem", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text3)", borderBottom: "1px solid var(--border)" }}>{label}</div>
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: "0.5rem" }}>{content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Color Picker ─────────────────────────────────────────────────
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}
function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}
function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    return Math.round(255 * (l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)))
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

const PRESETS = [
  { name: "Indigo", hex: "#7c6dff" },
  { name: "Coral", hex: "#ff5f7e" },
  { name: "Mint", hex: "#3fe8a0" },
  { name: "Sky", hex: "#38b6ff" },
  { name: "Amber", hex: "#ffba3b" },
  { name: "Mauve", hex: "#a29bfe" },
  { name: "Teal", hex: "#00cec9" },
  { name: "Pink", hex: "#fd79a8" },
  { name: "Lime", hex: "#badc58" },
  { name: "Tomato", hex: "#e55039" },
  { name: "Navy", hex: "#2c3e50" },
  { name: "Gold", hex: "#f9ca24" },
];

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

export function ColorTool() {
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

  const Section = ({ title, children }) => (
    <div style={{ marginBottom: "1.5rem" }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text3)", marginBottom: "0.75rem" }}>{title}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(110px,1fr))", gap: 10 }}>{children}</div>
    </div>
  );

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
          {PRESETS.map((p, i) => (
            <ColorSwatch key={i} hex={p.hex} name={p.name} onClick={apply} />
          ))}
        </Section>
      </div>
    </div>
  );
}
