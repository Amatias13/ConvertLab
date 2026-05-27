import { useState, useEffect, useRef } from "react";
import { ToolHeader } from "../components/UI";
import { CRON_PRESETS } from "../constants/tools";
import "./features.css";

function descField(f) {
  if (f === "*") return "every";
  if (f.startsWith("*/")) return `every ${f.slice(2)}`;
  if (f.includes("-")) {
    const [a, b] = f.split("-");
    return `${a}–${b}`;
  }
  if (f.includes(",")) return f.split(",").join(", ");
  return f;
}

function getNextRuns(expr, count = 10) {
  const parts = expr.split(/\s+/);
  if (parts.length !== 5) return [];
  const [min, hour, day, month, wd] = parts;
  const results = [];
  const d = new Date();
  d.setSeconds(0, 0);
  d.setMinutes(d.getMinutes() + 1);
  let tries = 0;
  const matches = (field, val) => {
    if (field === "*") return true;
    if (field.startsWith("*/")) return val % parseInt(field.slice(2)) === 0;
    if (field.includes("-")) {
      const [a, b] = field.split("-").map(Number);
      return val >= a && val <= b;
    }
    if (field.includes(",")) return field.split(",").map(Number).includes(val);
    return parseInt(field) === val;
  };
  while (results.length < count && tries < 527040) {
    tries++;
    if (matches(month, d.getMonth() + 1) && matches(day, d.getDate()) && matches(wd, d.getDay()) && matches(hour, d.getHours()) && matches(min, d.getMinutes())) {
      results.push(new Date(d));
    }
    d.setMinutes(d.getMinutes() + 1);
  }
  return results;
}

export default function CronTool() {
  const [expr, setExpr] = useState("0 9 * * 1-5");
  const [debouncedExpr, setDebouncedExpr] = useState("0 9 * * 1-5");
  const timerRef = useRef(null);

  const handleExprChange = (val) => {
    setExpr(val);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setDebouncedExpr(val), 300);
  };

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const parts = debouncedExpr.trim().split(/\s+/);
  const valid = parts.length === 5;
  const fieldDefs = [
    { name: "Minute", range: "0–59", val: parts[0] },
    { name: "Hour", range: "0–23", val: parts[1] },
    { name: "Day/month", range: "1–31", val: parts[2] },
    { name: "Month", range: "1–12", val: parts[3] },
    { name: "Day/week", range: "0–6", val: parts[4] },
  ];
  const nextRuns = valid ? getNextRuns(debouncedExpr) : [];

  return (
    <div className="tool-wrap">
      <ToolHeader title="Cron Expression Parser" desc="Explain cron expressions and preview next run times" />
      <div style={{ flex: 1, overflow: "auto", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1.1rem" }}>
        <div className="tool-card">
          <div className="tool-card-label">Expression</div>
          <input type="text" value={expr} onChange={(e) => handleExprChange(e.target.value)} className="mono-input" style={{ fontSize: "1.3rem" }} />
          <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
            {CRON_PRESETS.map((p) => (
              <button
                key={p.value}
                onClick={() => {
                  setExpr(p.value);
                  setDebouncedExpr(p.value);
                }}
                className="preset-btn"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {valid && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8 }}>
            {fieldDefs.map((f) => (
              <div key={f.name} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, padding: "0.75rem" }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text3)", marginBottom: 4 }}>
                  {f.name}
                  <br />
                  <span style={{ opacity: 0.6 }}>{f.range}</span>
                </div>
                <div style={{ fontFamily: "var(--mono)", fontSize: "1.1rem", color: "var(--accent)" }}>{f.val}</div>
                <div style={{ fontSize: 10, color: "var(--text2)", marginTop: 4 }}>{descField(f.val)}</div>
              </div>
            ))}
          </div>
        )}

        {nextRuns.length > 0 && (
          <div className="tool-card">
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text3)", marginBottom: 10 }}>Next 10 runs</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 12, lineHeight: 2.2, color: "var(--text2)" }}>
              {nextRuns.map((d, i) => (
                <div key={i}>
                  <span style={{ color: "var(--text3)", marginRight: 10 }}>{String(i + 1).padStart(2, " ")}.</span>
                  {d.toLocaleString()}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
