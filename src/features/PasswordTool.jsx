import { useState, useEffect, useCallback } from "react";
import { useApp } from "../context/AppContext";
import { useClipboard } from "../hooks/useClipboard";
import { ToolHeader, Panels, Panel0, PanelLabel, OptionsBar, OptLabel, OptGroup, OptBtn, Btn } from "../components/UI";
import { CHARSETS } from "../constants/tools";

function genPassword(length, opts) {
  let charset = "";
  if (opts.upper) charset += CHARSETS.upper;
  if (opts.lower) charset += CHARSETS.lower;
  if (opts.digits) charset += CHARSETS.digits;
  if (opts.symbols) charset += CHARSETS.symbols;
  if (opts.noSimilar)
    charset = charset
      .split("")
      .filter((c) => !CHARSETS.similar.includes(c))
      .join("");
  if (!charset) return "";
  const arr = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(arr)
    .map((b) => charset[b % charset.length])
    .join("");
}

function passwordStrength(pwd) {
  if (!pwd) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (pwd.length >= 16) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const levels = [
    { score: 0, label: "Too weak", color: "var(--accent2)" },
    { score: 2, label: "Weak", color: "var(--accent2)" },
    { score: 4, label: "Fair", color: "var(--accent4)" },
    { score: 5, label: "Good", color: "var(--accent5)" },
    { score: 6, label: "Strong", color: "var(--accent3)" },
    { score: 7, label: "Very strong", color: "var(--accent3)" },
  ];
  const level = [...levels].reverse().find((l) => score >= l.score) || levels[0];
  return { score, label: level.label, color: level.color, pct: Math.round((score / 7) * 100) };
}

export default function PasswordTool() {
  const { showToast } = useApp();
  const { copy } = useClipboard();
  const [length, setLength] = useState(20);
  const [count, setCount] = useState(5);
  const [opts, setOpts] = useState({ upper: true, lower: true, digits: true, symbols: true, noSimilar: false });
  const [passwords, setPasswords] = useState([]);

  const generate = useCallback(() => {
    setPasswords(Array.from({ length: count }, () => genPassword(length, opts)));
  }, [length, count, opts]);

  useEffect(() => {
    generate();
  }, [generate]);

  const toggle = (key) => setOpts((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
      <ToolHeader title="Password Generator" desc="Generate secure, cryptographically random passwords">
        <Btn primary onClick={generate}>
          Regenerate
        </Btn>
      </ToolHeader>

      <OptionsBar>
        <OptLabel>
          Length: <b style={{ color: "var(--text)", fontFamily: "var(--mono)" }}>{length}</b>
        </OptLabel>
        <input type="range" min={6} max={128} value={length} onChange={(e) => setLength(Number(e.target.value))} style={{ width: 120, accentColor: "var(--accent)" }} />
        <OptLabel style={{ marginLeft: "0.5rem" }}>Count:</OptLabel>
        <OptGroup>
          {[1, 5, 10].map((n) => (
            <OptBtn key={n} active={count === n} onClick={() => setCount(n)}>
              {n}
            </OptBtn>
          ))}
        </OptGroup>
      </OptionsBar>

      <OptionsBar>
        <OptLabel>Include:</OptLabel>
        {[
          ["upper", "A–Z"],
          ["lower", "a–z"],
          ["digits", "0–9"],
          ["symbols", "!@#…"],
          ["noSimilar", "No similar"],
        ].map(([k, l]) => (
          <OptBtn key={k} active={opts[k]} onClick={() => toggle(k)}>
            {l}
          </OptBtn>
        ))}
      </OptionsBar>

      <Panels>
        <Panel0>
          <PanelLabel right={`${count} passwords · ${length} chars each`}>Generated passwords — click to copy</PanelLabel>
          <div style={{ flex: 1, overflow: "auto", padding: "0.85rem", display: "flex", flexDirection: "column", gap: 8 }}>
            {passwords.map((pwd, i) => {
              const str = passwordStrength(pwd);
              return (
                <div
                  key={i}
                  onClick={() => {
                    copy(pwd, "Password copied!");
                  }}
                  style={{ display: "flex", flexDirection: "column", gap: 6, padding: "0.75rem", background: "var(--bg2)", borderRadius: 10, border: "1px solid var(--border)", cursor: "pointer", transition: "border-color 0.12s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border3)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                >
                  <div style={{ fontFamily: "var(--mono)", fontSize: 14, letterSpacing: "0.05em", wordBreak: "break-all", color: "var(--text)" }}>{pwd}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ flex: 1, height: 3, background: "var(--bg4)", borderRadius: 99 }}>
                      <div style={{ width: str.pct + "%", height: "100%", background: str.color, borderRadius: 99, transition: "all 0.3s" }} />
                    </div>
                    <span style={{ fontSize: 10, color: str.color, minWidth: 70 }}>{str.label}</span>
                    <span style={{ fontSize: 10, color: "var(--text3)" }}>copy</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel0>
      </Panels>
    </div>
  );
}
