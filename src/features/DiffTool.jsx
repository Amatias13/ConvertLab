import { useState, useMemo } from "react";
import { ToolHeader, Panels, Panel0, Panel, PanelLabel, CodeArea } from "../components/UI";
import { diff } from "../helpers/diff";

export default function DiffTool() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");

  const result = useMemo(() => diff(a, b), [a, b]);
  const adds = result.filter((d) => d.t === "+").length;
  const dels = result.filter((d) => d.t === "-").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
      <ToolHeader title="Text Diff" desc="Compare two texts and see line-by-line differences" />
      <Panels style={{ flex: "0 0 45%", minHeight: 140 }}>
        <Panel0>
          <PanelLabel>Original (A)</PanelLabel>
          <CodeArea value={a} onChange={setA} placeholder="Original text..." mono={false} />
        </Panel0>
        <Panel>
          <PanelLabel>Modified (B)</PanelLabel>
          <CodeArea value={b} onChange={setB} placeholder="Modified text..." mono={false} />
        </Panel>
      </Panels>
      <div style={{ borderTop: "1px solid var(--border)", padding: "0.45rem 1rem", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text3)", display: "flex", gap: "0.75rem", alignItems: "center" }}>
        Diff result
        {result.length > 0 && (
          <>
            <span style={{ color: "var(--accent3)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>+{adds}</span>
            <span style={{ color: "var(--accent2)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>−{dels}</span>
          </>
        )}
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: "0.75rem 1rem", fontFamily: "var(--mono)", fontSize: 12.5, lineHeight: 1.8 }}>
        {result.length === 0 ? (
          <span style={{ color: "var(--text3)" }}>Type in both fields to see the diff</span>
        ) : (
          result.map((d, i) => (
            <span
              key={i}
              style={{
                display: "block",
                padding: "0 0.4rem",
                borderRadius: 3,
                background: d.t === "+" ? "rgba(63,232,160,0.07)" : d.t === "-" ? "rgba(255,95,126,0.07)" : "transparent",
                color: d.t === "+" ? "var(--accent3)" : d.t === "-" ? "var(--accent2)" : "var(--text3)",
              }}
            >
              {d.t === "+" ? "+ " : d.t === "-" ? "- " : "  "}
              {d.v}
            </span>
          ))
        )}
      </div>
    </div>
  );
}
