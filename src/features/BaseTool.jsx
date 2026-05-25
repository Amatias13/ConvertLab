import { useState } from "react";
import { ToolHeader, OptionsBar, OptLabel } from "../components/UI";
import { BASE_OPTIONS } from "../constants/tools";

export default function BaseTool() {
  const [values, setValues] = useState({ dec: "", bin: "", oct: "", hex: "", custom: "" });
  const [customBase, setCustomBase] = useState(32);
  const [active, setActive] = useState(null);

  const convert = (from, raw) => {
    const v = { dec: "", bin: "", oct: "", hex: "", custom: "" };
    if (!raw.trim()) {
      setValues(v);
      return;
    }
    const base = from === "custom" ? customBase : BASE_OPTIONS.find((b) => b.id === from)?.radix;
    const dec = parseInt(raw, base);
    if (isNaN(dec)) {
      setValues((prev) => ({ ...prev, [from]: raw }));
      return;
    }
    v.dec = dec.toString(10);
    v.bin = dec.toString(2);
    v.oct = dec.toString(8);
    v.hex = dec.toString(16).toUpperCase();
    v.custom = dec.toString(customBase);
    v[from] = raw;
    setValues(v);
  };

  const cell = (id, label, sub, radix) => (
    <div
      key={id}
      style={{
        background: active === id ? "var(--bg2)" : "var(--bg)",
        padding: "1rem 1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: 4,
        transition: "background 0.15s",
      }}
    >
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text3)" }}>
        {label} <span style={{ opacity: 0.6 }}>({sub})</span>
      </div>
      <input
        value={values[id]}
        onChange={(e) => convert(id, e.target.value)}
        onFocus={() => setActive(id)}
        onBlur={() => setActive(null)}
        placeholder={id === "dec" ? "255" : id === "bin" ? "11111111" : id === "oct" ? "377" : "FF"}
        style={{
          background: "transparent",
          border: "none",
          outline: "none",
          fontFamily: "var(--mono)",
          fontSize: "1.2rem",
          color: "var(--text)",
          width: "100%",
          padding: 0,
        }}
      />
    </div>
  );

  return (
    <div className="tool-wrap">
      <ToolHeader title="Number Base Converter" desc="Convert between Binary, Octal, Decimal, Hex and custom bases" />

      <div style={{ flex: 1, overflow: "auto", padding: "1.25rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 1,
            background: "var(--border)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            overflow: "hidden",
            marginBottom: "1.25rem",
          }}
        >
          {BASE_OPTIONS.map(({ id, label, sub, radix }) => cell(id, label, sub, radix))}
        </div>

        <div style={{ background: "var(--bg2)", borderRadius: 12, border: "1px solid var(--border)", padding: "1rem 1.25rem", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text3)" }}>Custom base</div>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <label style={{ fontSize: 12, color: "var(--text2)" }}>Base:</label>
            <input
              type="number"
              min={2}
              max={36}
              value={customBase}
              onChange={(e) => {
                setCustomBase(Number(e.target.value));
                convert("dec", values.dec);
              }}
              style={{ width: 70, fontFamily: "var(--mono)", fontSize: 14 }}
            />
            <label style={{ fontSize: 12, color: "var(--text3)" }}>Value:</label>
            <input
              value={values.custom}
              onChange={(e) => convert("custom", e.target.value)}
              onFocus={() => setActive("custom")}
              onBlur={() => setActive(null)}
              placeholder="—"
              style={{
                flex: 1,
                background: active === "custom" ? "var(--bg3)" : "transparent",
                border: "1px solid var(--border2)",
                borderRadius: 8,
                padding: "0.4rem 0.75rem",
                fontFamily: "var(--mono)",
                fontSize: "1.1rem",
                color: "var(--text)",
                outline: "none",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
