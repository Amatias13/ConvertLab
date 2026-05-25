import "./styles.css";
import { useState, useRef } from "react";
import { useApp } from "../../context/AppContext";
import Tab from "../../components/Tab";
import Section from "../../components/Section";
import { ACCENT_PALETTES, FONT_OPTIONS } from "../../constants/theme";
import { ALL_TOOLS } from "../../data/tools";
import { STORAGE_KEYS } from "../../constants/app";

const TABS = [
  { id: "appearance", label: "🎨 Appearance" },
  { id: "profile", label: "👤 Profile" },
  { id: "history", label: "📊 History" },
  { id: "presets", label: "⚙️ Presets" },
];

export function ProfileModal() {
  const { modal, setModal, profile, saveProfile, setPassword, checkPassword, profileHash, theme, toggleTheme, history, exportPresets, importPresets, showToast } = useApp();
  const [tab, setTab] = useState("appearance");
  const [pwdInput, setPwdInput] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [pwdConfirm, setPwdConfirm] = useState("");
  const [unlocked, setUnlocked] = useState(!profileHash);
  const [pwdError, setPwdError] = useState("");
  const importRef = useRef();

  if (modal !== "profile") return null;

  const handleUnlock = async () => {
    if (!profileHash) {
      setUnlocked(true);
      return;
    }
    const ok = await checkPassword(pwdInput);
    if (ok) {
      setUnlocked(true);
      setPwdError("");
    } else setPwdError("Incorrect password");
  };

  const handleSetPassword = async () => {
    if (newPwd.length < 4) {
      setPwdError("Password must be at least 4 characters");
      return;
    }
    if (newPwd !== pwdConfirm) {
      setPwdError("Passwords do not match");
      return;
    }
    await setPassword(newPwd);
    setPwdError("");
    setNewPwd("");
    setPwdConfirm("");
    showToast("Password saved!", "success");
  };

  return (
    <div className="modal-backdrop" onClick={() => setModal(null)}>
      <div className="modal-box pm-box" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="pm-header">
          <span className="pm-header-title">⚙️ Settings</span>
          <div className="pm-header-tabs">
            {TABS.map((t) => (
              <Tab key={t.id} active={tab === t.id} onClick={() => setTab(t.id)} label={t.label} />
            ))}
          </div>
          <button onClick={() => setModal(null)} className="pm-close">
            ✕
          </button>
        </div>

        <div className="pm-body">
          {/* ── APPEARANCE ── */}
          {tab === "appearance" && (
            <div>
              <Section title="Theme">
                <div className="pm-theme-row">
                  {["dark", "light"].map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        if (theme !== t) toggleTheme();
                      }}
                      className={`pm-theme-btn${theme === t ? " active" : ""}`}
                      style={{ background: t === "dark" ? "#09090e" : "#f4f4f8" }}
                    >
                      <span className="pm-theme-btn-icon">{t === "dark" ? "🌙" : "☀️"}</span>
                      <span className="pm-theme-btn-label" style={{ color: t === "dark" ? "#eeeef5" : "#111118" }}>
                        {t === "dark" ? "Dark" : "Light"}
                      </span>
                    </button>
                  ))}
                </div>
              </Section>

              <Section title="Accent Colour Palette">
                <div className="pm-palette-grid">
                  {ACCENT_PALETTES.map((pal, idx) => (
                    <button key={pal.name} onClick={() => saveProfile({ paletteIdx: idx })} className={`pm-palette-btn${profile.paletteIdx === idx ? " active" : ""}`} style={{ borderColor: profile.paletteIdx === idx ? pal.accent || "var(--accent)" : "var(--border)" }}>
                      <div className="pm-palette-dots">
                        {[pal.accent || "#777", pal.accent2 || "#999", pal.accent3 || "#aaa"].map((col, i) => (
                          <div key={i} className="pm-palette-dot" style={{ background: col }} />
                        ))}
                      </div>
                      <span className="pm-palette-name">{pal.name}</span>
                    </button>
                  ))}
                </div>

                {ACCENT_PALETTES[profile.paletteIdx]?.name === "Custom" && (
                  <div className="pm-custom-grid">
                    {[
                      ["customAccent", "Primary"],
                      ["customAccent2", "Secondary"],
                      ["customAccent3", "Success"],
                    ].map(([key, label]) => (
                      <div key={key}>
                        <div className="pm-custom-label">{label}</div>
                        <div className="pm-custom-row">
                          <input type="color" value={profile[key] || "#7c6dff"} onChange={(e) => saveProfile({ [key]: e.target.value })} className="pm-color-input" />
                          <input type="text" value={profile[key] || ""} onChange={(e) => saveProfile({ [key]: e.target.value })} className="pm-text-input-mono" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Section>

              <Section title="Font Family">
                <div className="pm-font-grid">
                  {FONT_OPTIONS.map((f, idx) => (
                    <button key={f.name} onClick={() => saveProfile({ fontIdx: idx })} className={`pm-font-btn${profile.fontIdx === idx ? " active" : ""}`} style={{ fontFamily: f.value }}>
                      {f.name}
                    </button>
                  ))}
                </div>
              </Section>

              <Section title="Font Size">
                <div className="pm-fontsize-row">
                  <input type="range" min={12} max={18} value={profile.fontSize || 14} onChange={(e) => saveProfile({ fontSize: Number(e.target.value) })} style={{ flex: 1, accentColor: "var(--accent)" }} />
                  <span className="pm-fontsize-mono">{profile.fontSize || 14}px</span>
                  <button onClick={() => saveProfile({ fontSize: 14 })} className="pm-fontsize-reset">
                    Reset
                  </button>
                </div>
                <div className="pm-preview" style={{ fontSize: profile.fontSize || 14, fontFamily: FONT_OPTIONS[profile.fontIdx]?.value }}>
                  The quick brown fox jumps over the lazy dog — 0123456789
                </div>
              </Section>
            </div>
          )}

          {/* ── PROFILE ── */}
          {tab === "profile" && (
            <div>
              <Section title="Display Name">
                <input type="text" value={profile.displayName} onChange={(e) => saveProfile({ displayName: e.target.value })} placeholder="e.g. André Matias" />
                <div className="pm-hint">Shown in exported preset files. Stored locally only.</div>
              </Section>

              <Section title={profileHash ? "Change Password" : "Set a Password"}>
                {profileHash && !unlocked && (
                  <div className="pm-col">
                    <div className="pm-text">Enter your password to unlock settings:</div>
                    <div className="pm-row">
                      <input type="password" value={pwdInput} onChange={(e) => setPwdInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleUnlock()} placeholder="Password..." style={{ flex: 1 }} />
                      <button onClick={handleUnlock} className="pm-btn-primary">
                        Unlock
                      </button>
                    </div>
                    {pwdError && <div className="pm-error">{pwdError}</div>}
                  </div>
                )}
                {(unlocked || !profileHash) && (
                  <div className="pm-col">
                    <div className="pm-text">{profileHash ? "Set a new password:" : "Protect your settings with a password (optional):"}</div>
                    <input type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} placeholder="New password (min 4 chars)" />
                    <input type="password" value={pwdConfirm} onChange={(e) => setPwdConfirm(e.target.value)} placeholder="Confirm password" />
                    {pwdError && <div className="pm-error">{pwdError}</div>}
                    <div className="pm-row">
                      <button onClick={handleSetPassword} className="pm-btn-primary">
                        {profileHash ? "Update Password" : "Set Password"}
                      </button>
                      {profileHash && (
                        <button
                          onClick={async () => {
                            await setPassword("");
                            showToast("Password removed");
                          }}
                          className="pm-btn-secondary"
                        >
                          Remove Password
                        </button>
                      )}
                    </div>
                    <div className="pm-note">Password is hashed with SHA-256 and stored locally. ConvertLab never sends data to any server.</div>
                  </div>
                )}
              </Section>
            </div>
          )}

          {/* ── HISTORY ── */}
          {tab === "history" && (
            <div>
              <Section title={`Tool Usage History (${history.length} tools used)`}>
                {history.length === 0 ? (
                  <div className="pm-empty">Start using tools to see your history here.</div>
                ) : (
                  <div className="pm-col">
                    {history.slice(0, 20).map((h, i) => {
                      const tool = ALL_TOOLS.find((t) => t.id === h.id);
                      if (!tool) return null;
                      const maxCount = history[0]?.count || 1;
                      return (
                        <div key={h.id} className="pm-history-row">
                          <span className="pm-history-rank">#{i + 1}</span>
                          <span className="pm-history-icon" style={{ background: tool.color + "1a", color: tool.color }}>
                            {tool.icon}
                          </span>
                          <span className="pm-history-label">{tool.label}</span>
                          <div className="pm-bar-track">
                            <div className="pm-bar-fill" style={{ width: `${(h.count / maxCount) * 100}%`, background: tool.color }} />
                          </div>
                          <span className="pm-history-count">{h.count}×</span>
                          <span className="pm-history-date">{new Date(h.lastUsed).toLocaleDateString()}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Section>
              {history.length > 0 && (
                <button
                  onClick={() => {
                    localStorage.removeItem(STORAGE_KEYS.HISTORY);
                    showToast("History cleared");
                    setModal(null);
                  }}
                  className="pm-btn-danger"
                >
                  Clear history
                </button>
              )}
            </div>
          )}

          {/* ── PRESETS ── */}
          {tab === "presets" && (
            <div>
              <Section title="Export Presets">
                <div className="pm-presets-desc">
                  Export your theme, colors, font, and favorites to a <code className="pm-code-inline">.json</code> file. Share it across devices or back it up.
                </div>
                <button onClick={exportPresets} className="pm-btn-export">
                  ⬇ Export presets.json
                </button>
              </Section>

              <Section title="Import Presets">
                <div className="pm-presets-desc">Import a previously exported preset file to restore your settings.</div>
                <input
                  ref={importRef}
                  type="file"
                  accept=".json"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      importPresets(e.target.files[0]);
                      e.target.value = "";
                    }
                  }}
                />
                <button onClick={() => importRef.current?.click()} className="pm-btn-import">
                  ⬆ Import presets.json
                </button>
              </Section>

              <Section title="Reset Everything">
                <div className="pm-presets-desc">Reset all settings to defaults. This cannot be undone.</div>
                <button
                  onClick={() => {
                    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
                    showToast("All settings reset — reloading…", "warn");
                    setTimeout(() => window.location.reload(), 1200);
                  }}
                  className="pm-btn-reset"
                >
                  ↺ Reset to defaults
                </button>
              </Section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
