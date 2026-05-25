import { useState } from "react";
import { ToolHeader, Panels, Panel0, Panel, PanelLabel, CodeArea } from "../components/UI";
import { useClipboard } from "../hooks/useClipboard";

export default function CaseTool() {
  const { copy } = useClipboard();
  const [input, setInput] = useState("");

  const words = input.trim().replace(/[_-]/g, " ").split(/\s+/).filter(Boolean);

  const cases = input.trim()
    ? [
        { name: "UPPERCASE", val: input.toUpperCase() },
        { name: "lowercase", val: input.toLowerCase() },
        { name: "Title Case", val: words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ") },
        { name: "Sentence case", val: input.charAt(0).toUpperCase() + input.slice(1).toLowerCase() },
        { name: "camelCase", val: words.map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())).join("") },
        { name: "PascalCase", val: words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("") },
        { name: "snake_case", val: words.map((w) => w.toLowerCase()).join("_") },
        { name: "SCREAMING_SNAKE", val: words.map((w) => w.toUpperCase()).join("_") },
        { name: "kebab-case", val: words.map((w) => w.toLowerCase()).join("-") },
        { name: "TRAIN-CASE", val: words.map((w) => w.toUpperCase()).join("-") },
        { name: "dot.case", val: words.map((w) => w.toLowerCase()).join(".") },
        { name: "Reversed", val: input.split("").reverse().join("") },
        {
          name: "sPoNgEcAsE",
          val: input
            .split("")
            .map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()))
            .join(""),
        },
      ]
    : [];

  return (
    <div className="tool-wrap">
      <ToolHeader title="Case Converter" desc="Transform text between different naming conventions" />
      <Panels>
        <Panel0 style={{ maxWidth: 320 }}>
          <PanelLabel>Input text</PanelLabel>
          <CodeArea value={input} onChange={setInput} placeholder={"Type or paste text...\n\nhello world foo bar"} mono={false} />
        </Panel0>
        <Panel>
          <PanelLabel>All conversions — click any to copy</PanelLabel>
          <div style={{ flex: 1, overflow: "auto", padding: "0.85rem", display: "flex", flexDirection: "column", gap: 6 }}>
            {cases.length === 0 ? (
              <div style={{ fontSize: 12, color: "var(--text3)" }}>Type text to see all case conversions</div>
            ) : (
              cases.map((c) => (
                <div
                  key={c.name}
                  onClick={() => {
                    copy(c.val, "Copied: " + c.name);
                  }}
                  style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", padding: "0.5rem 0.75rem", background: "var(--bg2)", borderRadius: 8, border: "1px solid var(--border)", cursor: "pointer", transition: "border-color 0.12s" }}
                >
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text3)", minWidth: 108 }}>{c.name}</span>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 12.5, color: "var(--text)", wordBreak: "break-all", flex: 1 }}>{c.val}</span>
                  <span style={{ fontSize: 10, color: "var(--text3)", flexShrink: 0 }}>copy</span>
                </div>
              ))
            )}
          </div>
        </Panel>
      </Panels>
    </div>
  );
}
