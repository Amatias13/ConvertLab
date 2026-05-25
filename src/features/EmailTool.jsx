import { useState } from "react";
import { ToolHeader, Panels, Panel0, Panel, PanelLabel, OptGroup, OptBtn } from "../components/UI";

export default function EmailTool() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [format, setFormat] = useState("text");

  return (
    <div className="tool-wrap">
      <ToolHeader title="Email Preview" desc="Preview how your email will look" />

      <Panels>
        <Panel0 style={{ maxWidth: 320 }}>
          <PanelLabel>Email fields</PanelLabel>
          <div style={{ flex: 1, overflow: "auto", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              ["From", from, setFrom],
              ["To", to, setTo],
              ["Subject", subject, setSubject],
            ].map(([label, val, setter]) => (
              <div key={label}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text3)", marginBottom: 4 }}>{label}</div>
                <input type="text" value={val} onChange={(e) => setter(e.target.value)} placeholder={`${label.toLowerCase()}@example.com`} />
              </div>
            ))}
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text3)", marginBottom: 4 }}>Body</div>
              <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Email body..." rows={8} style={{ resize: "none" }} />
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text3)", marginBottom: 6 }}>Format</div>
              <OptGroup>
                <OptBtn active={format === "text"} onClick={() => setFormat("text")}>
                  Plain text
                </OptBtn>
                <OptBtn active={format === "html"} onClick={() => setFormat("html")}>
                  HTML
                </OptBtn>
              </OptGroup>
            </div>
          </div>
        </Panel0>

        <Panel>
          <PanelLabel>Preview</PanelLabel>
          <div style={{ flex: 1, overflow: "auto", padding: "1.5rem" }}>
            <div style={{ maxWidth: 600, margin: "0 auto", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", fontFamily: "var(--sans)" }}>
              <div style={{ background: "var(--bg3)", padding: "0.85rem 1rem", borderBottom: "1px solid var(--border)" }}>
                {[
                  ["From", from || "—"],
                  ["To", to || "—"],
                ].map(([l, v]) => (
                  <div key={l} style={{ display: "flex", gap: "0.5rem", fontSize: 12, marginBottom: 2 }}>
                    <span style={{ color: "var(--text3)", minWidth: 38 }}>{l}:</span>
                    <span style={{ color: "var(--text2)" }}>{v}</span>
                  </div>
                ))}
                <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text)", marginTop: 6 }}>{subject || "No subject"}</div>
              </div>
              <div style={{ background: "var(--bg)", padding: "1.5rem", minHeight: 200, fontSize: 14, lineHeight: 1.7, color: "var(--text2)", whiteSpace: format === "text" ? "pre-wrap" : "normal" }}>
                {format === "html" ? <div dangerouslySetInnerHTML={{ __html: body }} /> : body || <span style={{ color: "var(--text3)" }}>Email body will appear here...</span>}
              </div>
            </div>
          </div>
        </Panel>
      </Panels>
    </div>
  );
}
