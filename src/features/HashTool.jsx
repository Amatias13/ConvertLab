import { useState, useEffect } from "react";
import { ToolHeader, Panels, Panel0, Panel, PanelLabel, Btn, CodeArea } from "../components/UI";
import { useClipboard } from "../hooks/useClipboard";
import { ALGOS } from "../constants/tools";

async function hashText(text, algo) {
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest(algo, enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function HashTool() {
  const { copy } = useClipboard();
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState({});

  useEffect(() => {
    if (!input) {
      setHashes({});
      return;
    }
    Promise.all(ALGOS.map((a) => hashText(input, a).then((h) => [a, h]))).then((results) => setHashes(Object.fromEntries(results)));
  }, [input]);

  return (
    <div className="tool-wrap">
      <ToolHeader title="Hash Generator" desc="Generate SHA-1, SHA-256, SHA-384, SHA-512 hashes" />

      <Panels>
        <Panel0 style={{ maxWidth: 300 }}>
          <PanelLabel>Input text</PanelLabel>
          <CodeArea value={input} onChange={setInput} placeholder="Type or paste text to hash..." mono={false} />
        </Panel0>

        <Panel>
          <PanelLabel>Hash results</PanelLabel>
          <div style={{ flex: 1, overflow: "auto", padding: "1rem", display: "flex", flexDirection: "column", gap: 10 }}>
            {ALGOS.length > 0 && input ? (
              ALGOS.map((algo) => (
                <div
                  key={algo}
                  style={{
                    display: "flex",
                    gap: "1rem",
                    alignItems: "baseline",
                    padding: "0.65rem 0.85rem",
                    background: "var(--bg2)",
                    borderRadius: 10,
                    border: "1px solid var(--border)",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    copy(hashes[algo] || "", "Copied " + algo);
                  }}
                >
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text3)", minWidth: 72 }}>{algo}</span>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 11.5, color: "var(--accent3)", wordBreak: "break-all", flex: 1 }}>{hashes[algo] || "—"}</span>
                  <span style={{ fontSize: 10, color: "var(--text3)", flexShrink: 0 }}>copy</span>
                </div>
              ))
            ) : (
              <div style={{ fontSize: 12, color: "var(--text3)" }}>Type something to generate hashes...</div>
            )}
          </div>
        </Panel>
      </Panels>
    </div>
  );
}
