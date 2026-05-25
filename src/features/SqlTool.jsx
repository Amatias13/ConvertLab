import { useState, useMemo } from "react";
import { useClipboard } from "../hooks/useClipboard";
import { ToolHeader, Panels, Panel0, Panel, PanelLabel, OptionsBar, OptLabel, OptGroup, OptBtn, Btn, CodeArea } from "../components/UI";
import { SQL_KEYWORDS, SQL_CLAUSES } from "../constants/tools";

const KW_REGEXES = SQL_KEYWORDS.map((kw) => [new RegExp(`\\b${kw}\\b`, "gi"), kw]);
const CLS_REGEXES = SQL_CLAUSES.map((c) => [new RegExp(`\\s+${c}\\b`, "g"), `\n${c}`]);
const HL_RE = new RegExp(`\\b(${SQL_KEYWORDS.map((k) => k.replace(/\s+/g, "\\s+")).join("|")})\\b`, "gi");

function formatSQL(sql, indent = 2) {
  const pad = " ".repeat(indent);
  let result = sql.trim();
  KW_REGEXES.forEach(([re, kw]) => {
    result = result.replace(re, kw);
  });
  CLS_REGEXES.forEach(([re, replacement]) => {
    result = result.replace(re, replacement);
  });
  result = result.replace(/SELECT\s+/g, "SELECT\n" + pad);
  result = result.replace(/,\s*(?=[^\n])/g, ",\n" + pad);
  result = result.replace(/\n{3,}/g, "\n\n").trim();
  return result;
}

function minifySQL(sql) {
  return sql.replace(/\s+/g, " ").trim();
}

function highlightSQL(sql) {
  return sql
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/'([^']*)'/g, "<span style=\"color:var(--accent3)\">'$1'</span>")
    .replace(/`([^`]*)`/g, '<span style="color:var(--accent4)">`$1`</span>')
    .replace(/--[^\n]*/g, '<span style="color:var(--text3)">$&</span>')
    .replace(HL_RE, '<span style="color:var(--accent5);font-weight:600">$1</span>')
    .replace(/\b(\d+)\b/g, '<span style="color:var(--accent4)">$1</span>');
}

export default function SqlTool() {
  const { copy } = useClipboard();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [indent, setIndent] = useState(2);
  const [mode, setMode] = useState("highlight");

  const highlighted = useMemo(() => highlightSQL(output || input), [output, input]);

  const format = () => {
    setOutput(formatSQL(input, indent));
    setMode("formatted");
  };
  const minify = () => {
    setOutput(minifySQL(input));
    setMode("formatted");
  };

  return (
    <div className="tool-wrap">
      <ToolHeader title="SQL Formatter" desc="Format, minify and syntax-highlight SQL queries">
        <Btn onClick={minify}>Minify</Btn>
        <Btn primary onClick={format}>
          Format
        </Btn>
      </ToolHeader>

      <OptionsBar>
        <OptLabel>Indent:</OptLabel>
        <OptGroup>
          {[2, 4].map((v) => (
            <OptBtn key={v} active={indent === v} onClick={() => setIndent(v)}>
              {v}
            </OptBtn>
          ))}
        </OptGroup>
        <OptLabel style={{ marginLeft: "0.75rem" }}>View:</OptLabel>
        <OptGroup>
          <OptBtn active={mode === "highlight"} onClick={() => setMode("highlight")}>
            Highlighted
          </OptBtn>
          <OptBtn active={mode === "formatted"} onClick={() => setMode("formatted")}>
            Plain
          </OptBtn>
        </OptGroup>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          <Btn
            onClick={() => {
              copy(output || input, "Copied");
            }}
          >
            Copy
          </Btn>
          <Btn
            onClick={() => {
              setInput("");
              setOutput("");
            }}
          >
            Clear
          </Btn>
        </div>
      </OptionsBar>

      <Panels>
        <Panel0>
          <PanelLabel>SQL Input</PanelLabel>
          <CodeArea
            value={input}
            onChange={(v) => {
              setInput(v);
              setOutput("");
            }}
            placeholder={"SELECT u.id, u.name, COUNT(o.id) AS orders\nFROM users u LEFT JOIN orders o ON u.id = o.user_id\nWHERE u.active = 1 GROUP BY u.id ORDER BY orders DESC LIMIT 10"}
          />
        </Panel0>
        <Panel>
          <PanelLabel>Output</PanelLabel>
          {mode === "highlight" ? (
            <div style={{ flex: 1, overflow: "auto", padding: "0.9rem 1rem", fontFamily: "var(--mono)", fontSize: 12.5, lineHeight: 1.75, whiteSpace: "pre-wrap", wordBreak: "break-word" }} dangerouslySetInnerHTML={{ __html: highlighted }} />
          ) : (
            <CodeArea value={output} readOnly placeholder="Formatted SQL will appear here..." />
          )}
        </Panel>
      </Panels>
    </div>
  );
}
