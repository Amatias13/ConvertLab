import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { useClipboard } from "../hooks/useClipboard";
import { ToolHeader, OptionsBar, OptLabel, OptGroup, OptBtn } from "../components/UI";
import { UNIT_CATEGORIES } from "../constants/tools";

function convertTemp(val, from, to) {
  let celsius;
  if (from === "°C") celsius = val;
  else if (from === "°F") celsius = ((val - 32) * 5) / 9;
  else celsius = val - 273.15;
  if (to === "°C") return celsius;
  if (to === "°F") return (celsius * 9) / 5 + 32;
  return celsius + 273.15;
}

function convertUnit(val, from, to, cat) {
  if (cat === "Temperature") return convertTemp(val, from, to);
  const toBase = UNIT_CATEGORIES[cat].toBase;
  return (val * toBase[from]) / toBase[to];
}

function fmt(n) {
  if (n === undefined || isNaN(n)) return "—";
  if (Math.abs(n) >= 1e9 || (Math.abs(n) < 1e-4 && n !== 0)) return n.toExponential(6);
  return parseFloat(n.toPrecision(10)).toString();
}

export default function UnitConverterTool() {
  const { showToast } = useApp();
  const { copy } = useClipboard();
  const [category, setCategory] = useState("Length");
  const [from, setFrom] = useState("m");
  const [value, setValue] = useState("");

  const cat = UNIT_CATEGORIES[category];

  useEffect(() => {
    setFrom(cat.units[0]);
    setValue("");
  }, [category]);

  const numVal = parseFloat(value);

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
      <ToolHeader title="Unit Converter" desc="Convert between Length, Weight, Temperature, Volume, Speed, Storage, Time" />

      <OptionsBar>
        <OptLabel>Category:</OptLabel>
        <OptGroup style={{ flexWrap: "wrap" }}>
          {Object.keys(UNIT_CATEGORIES).map((c) => (
            <OptBtn key={c} active={category === c} onClick={() => setCategory(c)}>
              {c}
            </OptBtn>
          ))}
        </OptGroup>
      </OptionsBar>

      <div style={{ flex: 1, overflow: "auto", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: "1rem" }}>
          <input type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Enter value..." style={{ fontFamily: "var(--mono)", fontSize: "1.3rem", flex: 1, background: "transparent", border: "none", outline: "none", color: "var(--text)", padding: 0 }} />
          <select value={from} onChange={(e) => setFrom(e.target.value)} style={{ fontFamily: "var(--mono)", fontSize: "1rem", background: "var(--bg3)", border: "1px solid var(--border2)", borderRadius: 8, color: "var(--text)", padding: "0.4rem 0.75rem", outline: "none", cursor: "pointer" }}>
            {cat.units.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 8 }}>
          {cat.units
            .filter((u) => u !== from)
            .map((to) => {
              const result = value !== "" && !isNaN(numVal) ? convertUnit(numVal, from, to, category) : null;
              return (
                <div
                  key={to}
                  onClick={() => {
                    if (result !== null) {
                      copy(fmt(result), `Copied: ${fmt(result)} ${to}`);
                    }
                  }}
                  style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, padding: "0.75rem", cursor: result !== null ? "pointer" : "default", transition: "border-color 0.12s" }}
                  onMouseEnter={(e) => {
                    if (result !== null) e.currentTarget.style.borderColor = "var(--border3)";
                  }}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                >
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text3)", marginBottom: 4 }}>{to}</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: "1rem", color: result !== null ? "var(--text)" : "var(--text3)" }}>{result !== null ? fmt(result) : "—"}</div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
