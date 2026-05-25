import { useState } from "react";
import { ToolHeader, Panels, Panel0, Panel, PanelLabel, OptionsBar, OptLabel, OptBtn, Btn, CodeArea } from "../components/UI";
import { callAI, hasSK } from "../services/pollinations";
import { AI_MODELS, AI_MODES } from "../constants/tools";
import { useApp } from "../context/AppContext";
import { useClipboard } from "../hooks/useClipboard";
import { POLLINATIONS_HOME } from "../services/pollinations";

export default function AiTool() {
  const { showToast } = useApp();
  const { copy } = useClipboard();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState("improve");
  const [model, setModel] = useState("openai");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const run = async () => {
    if (!input.trim()) {
      showToast("Please enter some text first", "warn");
      return;
    }
    const sel = AI_MODES.find((m) => m.id === mode);
    setLoading(true);
    setOutput("");
    setError("");
    try {
      const result = await callAI(sel.system, input, model);
      setOutput(result);
    } catch (e) {
      setError(e?.message || "all_failed");
      showToast("AI unavailable — try again shortly", "err");
    }
    setLoading(false);
  };

  const wc = (t) => t.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="tool-wrap">
      <ToolHeader title="AI Text Enhancer" desc="Improve, rewrite, summarise and translate — free, no key needed">
        {output && (
          <Btn
            onClick={() => {
              copy(output, "Copied");
            }}
          >
            Copy
          </Btn>
        )}
        <Btn primary onClick={run} style={{ minWidth: 90 }}>
          {loading ? "⟳ Running…" : "▶ Run AI"}
        </Btn>
      </ToolHeader>

      <div style={{ padding: "0.4rem 1rem", borderBottom: "1px solid var(--border)", display: "flex", gap: "0.5rem", alignItems: "center", background: "rgba(63,232,160,0.04)" }}>
        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 100, background: "rgba(63,232,160,0.15)", color: "var(--accent3)", border: "1px solid rgba(63,232,160,0.25)", flexShrink: 0 }}>FREE</span>
        <span style={{ fontSize: 11.5, color: "var(--text3)" }}>
          Powered by{" "}
          <a href={POLLINATIONS_HOME} target="_blank" rel="noreferrer" style={{ color: "var(--accent5)" }}>
            Pollinations.ai
          </a>
          {hasSK ? " — running with API key (full access)" : " — anonymous mode (no key, rate limited)"}
        </span>
      </div>

      <OptionsBar>
        <OptLabel>Model:</OptLabel>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {AI_MODELS.map((m) => (
            <OptBtn key={m.id} active={model === m.id} onClick={() => setModel(m.id)}>
              {m.label}
            </OptBtn>
          ))}
        </div>
      </OptionsBar>

      <OptionsBar>
        <OptLabel>Mode:</OptLabel>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {AI_MODES.map((m) => (
            <OptBtn key={m.id} active={mode === m.id} onClick={() => setMode(m.id)}>
              {m.label}
            </OptBtn>
          ))}
        </div>
      </OptionsBar>

      <Panels>
        <Panel0>
          <PanelLabel right={`${wc(input)} words`}>Your text</PanelLabel>
          <CodeArea value={input} onChange={setInput} placeholder={'Paste or type your text here…\n\nExample:\n"The quick brown fox jumps over the lazy dog."'} mono={false} />
        </Panel0>

        <Panel>
          <PanelLabel right={output ? `${wc(output)} words` : ""}>
            AI result
            {loading && <span style={{ marginLeft: 8, fontSize: 10, color: "var(--accent)", animation: "pulse 1s infinite" }}>● generating…</span>}
          </PanelLabel>

          {loading ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, padding: "1rem" }}>
              {[100, 80, 92, 65, 85, 55, 75].map((w, i) => (
                <div key={i} className="ai-shimmer" style={{ height: 13, borderRadius: 7, width: w + "%" }} />
              ))}
            </div>
          ) : error ? (
            <div style={{ flex: 1, padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ padding: "0.85rem", background: "rgba(255,95,126,0.06)", border: "1px solid rgba(255,95,126,0.2)", borderRadius: 10, fontSize: 12.5, color: "var(--accent2)", lineHeight: 1.6 }}>⚠️ Pollinations.ai is temporarily unavailable.</div>
              <Btn onClick={run}>↺ Try again</Btn>
            </div>
          ) : output ? (
            <CodeArea value={output} onChange={setOutput} mono={false} />
          ) : (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.85rem", padding: "2rem", textAlign: "center" }}>
              <div style={{ fontSize: "2.5rem" }}>✨</div>
              <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.7 }}>
                Select a <strong>model</strong> and <strong>mode</strong>,<br />
                enter your text and click <strong>Run AI</strong>
              </div>
            </div>
          )}
        </Panel>
      </Panels>
    </div>
  );
}
