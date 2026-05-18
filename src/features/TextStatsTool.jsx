import { useState, useMemo } from "react";
import { ToolHeader, Panels, Panel0, Panel, PanelLabel, CodeArea } from "../components/UI";

function analyzeText(text) {
  if (!text) return null;
  const words = text.trim() ? text.trim().split(/\s+/) : [];
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim());
  const paragraphs = text.split(/\n\n+/).filter((p) => p.trim());
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, "").length;
  const lines = text.split("\n");
  const readingTime = Math.ceil(words.length / 238);

  const freq = {};
  words.forEach((w) => {
    const clean = w.toLowerCase().replace(/[^a-z]/g, "");
    if (clean.length > 2) freq[clean] = (freq[clean] || 0) + 1;
  });
  const topWords = Object.entries(freq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);
  const unique = new Set(words.map((w) => w.toLowerCase().replace(/[^a-z]/g, "")).filter(Boolean)).size;
  const avgWordLen = words.length ? (words.reduce((s, w) => s + w.replace(/[^a-z]/gi, "").length, 0) / words.length).toFixed(1) : 0;

  return { chars, charsNoSpace, words: words.length, sentences: sentences.length, paragraphs: paragraphs.length, lines: lines.length, unique, avgWordLen, readingTime, topWords };
}

function StatCard({ label, value, sub, color }) {
  return (
    <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, padding: "0.85rem 1rem" }}>
      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text3)", marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: "var(--mono)", fontSize: "1.4rem", fontWeight: 500, color: color || "var(--text)" }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

export default function TextStatsTool() {
  const [input, setInput] = useState("");
  const stats = useMemo(() => analyzeText(input), [input]);

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
      <ToolHeader title="Text Statistics" desc="Analyze text — word count, reading time, frequency and more" />

      <Panels>
        <Panel0 style={{ maxWidth: 360 }}>
          <PanelLabel>Input text</PanelLabel>
          <CodeArea value={input} onChange={setInput} placeholder="Paste or type text to analyze..." mono={false} />
        </Panel0>

        <Panel>
          <PanelLabel>Analysis</PanelLabel>
          <div style={{ flex: 1, overflow: "auto", padding: "1rem" }}>
            {!stats ? (
              <div style={{ fontSize: 12, color: "var(--text3)" }}>Type or paste text to see statistics</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 8 }}>
                  <StatCard label="Characters" value={stats.chars.toLocaleString()} sub={`${stats.charsNoSpace.toLocaleString()} no spaces`} />
                  <StatCard label="Words" value={stats.words.toLocaleString()} sub={`${stats.unique} unique`} color="var(--accent)" />
                  <StatCard label="Sentences" value={stats.sentences.toLocaleString()} />
                  <StatCard label="Paragraphs" value={stats.paragraphs.toLocaleString()} />
                  <StatCard label="Lines" value={stats.lines.toLocaleString()} />
                  <StatCard label="Avg word" value={stats.avgWordLen} sub="chars/word" />
                  <StatCard label="Reading time" value={`~${stats.readingTime}m`} sub="at 238 wpm" color="var(--accent3)" />
                </div>

                {stats.topWords.length > 0 && (
                  <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, padding: "0.85rem 1rem" }}>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text3)", marginBottom: 10 }}>Top words</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                      {stats.topWords.map(([word, count]) => (
                        <div key={word} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--text)", minWidth: 80 }}>{word}</span>
                          <div style={{ flex: 1, height: 4, background: "var(--bg4)", borderRadius: 99 }}>
                            <div style={{ width: `${(count / stats.topWords[0][1]) * 100}%`, height: "100%", background: "var(--accent)", borderRadius: 99 }} />
                          </div>
                          <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text3)", minWidth: 24, textAlign: "right" }}>{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </Panel>
      </Panels>
    </div>
  );
}
