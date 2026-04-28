import { useState, useRef } from 'react'
import { useApp, ACCENT_PALETTES, FONT_OPTIONS } from '../context/AppContext'
import { ALL_TOOLS } from '../tools/registry'

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '0.75rem', paddingBottom: '0.4rem', borderBottom: '1px solid var(--border)' }}>
        {title}
      </div>
      {children}
    </div>
  )
}

export function ProfileModal() {
  const { modal, setModal, profile, saveProfile, setPassword, checkPassword, profileHash, theme, toggleTheme, history, exportPresets, importPresets, showToast } = useApp()
  const [tab, setTab] = useState('appearance')
  const [pwdInput, setPwdInput] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [pwdConfirm, setPwdConfirm] = useState('')
  const [unlocked, setUnlocked] = useState(!profileHash)
  const [pwdError, setPwdError] = useState('')
  const importRef = useRef()

  if (modal !== 'profile') return null

  const handleUnlock = async () => {
    if (!profileHash) { setUnlocked(true); return }
    const ok = await checkPassword(pwdInput)
    if (ok) { setUnlocked(true); setPwdError('') }
    else setPwdError('Incorrect password')
  }

  const handleSetPassword = async () => {
    if (newPwd.length < 4) { setPwdError('Password must be at least 4 characters'); return }
    if (newPwd !== pwdConfirm) { setPwdError('Passwords do not match'); return }
    await setPassword(newPwd)
    setPwdError('')
    setNewPwd('')
    setPwdConfirm('')
    showToast('Password saved!', 'success')
  }

  const tabs = [
    { id: 'appearance', label: '🎨 Appearance' },
    { id: 'profile',    label: '👤 Profile' },
    { id: 'history',    label: '📊 History' },
    { id: 'presets',    label: '⚙️ Presets' },
  ]

  const TabBtn = ({ id, label }) => (
    <button onClick={() => setTab(id)} style={{ padding: '0.45rem 0.85rem', borderRadius: 8, border: 'none', background: tab === id ? 'var(--accent)' : 'transparent', color: tab === id ? '#fff' : 'var(--text2)', fontSize: 12.5, cursor: 'pointer', fontFamily: 'var(--sans)', transition: 'all 0.15s', whiteSpace: 'nowrap' }}>
      {label}
    </button>
  )

  return (
    <div className="modal-backdrop" onClick={() => setModal(null)}>
      <div className="modal-box" style={{ width: '100%', maxWidth: 580 }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          <span style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '1rem' }}>⚙️ Settings</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
            {tabs.map(t => <TabBtn key={t.id} {...t} />)}
          </div>
          <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', fontSize: 18, lineHeight: 1, marginLeft: '0.5rem' }}>✕</button>
        </div>

        <div style={{ overflow: 'auto', padding: '1.5rem', flex: 1 }}>

          {/* ── APPEARANCE ── */}
          {tab === 'appearance' && (
            <div>
              <Section title="Theme">
                <div style={{ display: 'flex', gap: 8 }}>
                  {['dark', 'light'].map(t => (
                    <button key={t} onClick={() => { if (theme !== t) toggleTheme() }}
                      style={{ flex: 1, padding: '0.75rem', borderRadius: 10, border: `2px solid ${theme === t ? 'var(--accent)' : 'var(--border)'}`, background: t === 'dark' ? '#09090e' : '#f4f4f8', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, transition: 'all 0.15s' }}>
                      <span style={{ fontSize: '1.4rem' }}>{t === 'dark' ? '🌙' : '☀️'}</span>
                      <span style={{ fontSize: 12, fontFamily: 'var(--sans)', color: t === 'dark' ? '#eeeef5' : '#111118', fontWeight: theme === t ? 700 : 400 }}>{t === 'dark' ? 'Dark' : 'Light'}</span>
                    </button>
                  ))}
                </div>
              </Section>

              <Section title="Accent Colour Palette">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {ACCENT_PALETTES.map((pal, idx) => (
                    <button key={pal.name} onClick={() => saveProfile({ paletteIdx: idx })}
                      style={{ padding: '0.65rem 0.75rem', borderRadius: 10, border: `2px solid ${profile.paletteIdx === idx ? pal.accent || 'var(--accent)' : 'var(--border)'}`, background: 'var(--bg3)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.15s' }}>
                      <div style={{ display: 'flex', gap: 3 }}>
                        {[pal.accent || '#888', pal.accent2 || '#999', pal.accent3 || '#aaa'].map((c, i) => (
                          <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
                        ))}
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--text2)', fontFamily: 'var(--sans)' }}>{pal.name}</span>
                    </button>
                  ))}
                </div>

                {/* Custom palette picker */}
                {ACCENT_PALETTES[profile.paletteIdx]?.name === 'Custom' && (
                  <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                    {[['customAccent', 'Primary'], ['customAccent2', 'Secondary'], ['customAccent3', 'Success']].map(([key, label]) => (
                      <div key={key}>
                        <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 4 }}>{label}</div>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <input type="color" value={profile[key] || '#7c6dff'} onChange={e => saveProfile({ [key]: e.target.value })}
                            style={{ width: 32, height: 28, border: 'none', background: 'none', cursor: 'pointer', padding: 0 }} />
                          <input type="text" value={profile[key] || ''} onChange={e => saveProfile({ [key]: e.target.value })}
                            style={{ fontFamily: 'var(--mono)', fontSize: 11, flex: 1 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Section>

              <Section title="Font Family">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                  {FONT_OPTIONS.map((f, idx) => (
                    <button key={f.name} onClick={() => saveProfile({ fontIdx: idx })}
                      style={{ padding: '0.6rem 0.75rem', borderRadius: 9, border: `2px solid ${profile.fontIdx === idx ? 'var(--accent)' : 'var(--border)'}`, background: 'var(--bg3)', cursor: 'pointer', fontFamily: f.value, fontSize: 13, color: profile.fontIdx === idx ? 'var(--text)' : 'var(--text2)', transition: 'all 0.15s' }}>
                      {f.name}
                    </button>
                  ))}
                </div>
              </Section>

              <Section title="Font Size">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <input type="range" min={12} max={18} value={profile.fontSize || 14} onChange={e => saveProfile({ fontSize: Number(e.target.value) })}
                    style={{ flex: 1, accentColor: 'var(--accent)' }} />
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--text)', minWidth: 40 }}>{profile.fontSize || 14}px</span>
                  <button onClick={() => saveProfile({ fontSize: 14 })} style={{ fontSize: 11, color: 'var(--text3)', background: 'none', border: '1px solid var(--border)', borderRadius: 6, padding: '2px 8px', cursor: 'pointer', fontFamily: 'var(--sans)' }}>Reset</button>
                </div>
                <div style={{ marginTop: 8, padding: '0.6rem 0.85rem', background: 'var(--bg3)', borderRadius: 8, fontSize: profile.fontSize || 14, fontFamily: FONT_OPTIONS[profile.fontIdx]?.value, color: 'var(--text2)' }}>
                  The quick brown fox jumps over the lazy dog — 0123456789
                </div>
              </Section>
            </div>
          )}

          {/* ── PROFILE ── */}
          {tab === 'profile' && (
            <div>
              <Section title="Display Name">
                <input type="text" value={profile.displayName} onChange={e => saveProfile({ displayName: e.target.value })}
                  placeholder="e.g. André Matias" style={{ fontFamily: 'var(--sans)', fontSize: 14 }} />
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 6 }}>Shown in exported preset files. Stored locally only.</div>
              </Section>

              <Section title={profileHash ? 'Change Password' : 'Set a Password'}>
                {profileHash && !unlocked && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ fontSize: 12, color: 'var(--text2)' }}>Enter your password to unlock settings:</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input type="password" value={pwdInput} onChange={e => setPwdInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleUnlock()} placeholder="Password..." style={{ flex: 1 }} />
                      <button onClick={handleUnlock} style={{ padding: '0.45rem 0.85rem', borderRadius: 8, border: 'none', background: 'var(--accent)', color: '#fff', cursor: 'pointer', fontFamily: 'var(--sans)', fontWeight: 600, fontSize: 13 }}>Unlock</button>
                    </div>
                    {pwdError && <div style={{ fontSize: 12, color: 'var(--accent2)' }}>{pwdError}</div>}
                  </div>
                )}
                {(unlocked || !profileHash) && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ fontSize: 12, color: 'var(--text2)' }}>
                      {profileHash ? 'Set a new password:' : 'Protect your settings with a password (optional):'}
                    </div>
                    <input type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} placeholder="New password (min 4 chars)" />
                    <input type="password" value={pwdConfirm} onChange={e => setPwdConfirm(e.target.value)} placeholder="Confirm password" />
                    {pwdError && <div style={{ fontSize: 12, color: 'var(--accent2)' }}>{pwdError}</div>}
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={handleSetPassword} style={{ padding: '0.45rem 0.85rem', borderRadius: 8, border: 'none', background: 'var(--accent)', color: '#fff', cursor: 'pointer', fontFamily: 'var(--sans)', fontWeight: 600, fontSize: 13 }}>
                        {profileHash ? 'Update Password' : 'Set Password'}
                      </button>
                      {profileHash && <button onClick={async () => { await setPassword(''); showToast('Password removed') }} style={{ padding: '0.45rem 0.85rem', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text2)', cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: 13 }}>Remove Password</button>}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text3)', lineHeight: 1.5 }}>
                      Password is hashed with SHA-256 and stored locally. ConvertLab never sends data to any server.
                    </div>
                  </div>
                )}
              </Section>
            </div>
          )}

          {/* ── HISTORY ── */}
          {tab === 'history' && (
            <div>
              <Section title={`Tool Usage History (${history.length} tools used)`}>
                {history.length === 0 ? (
                  <div style={{ fontSize: 13, color: 'var(--text3)', padding: '1rem 0' }}>Start using tools to see your history here.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {history.slice(0, 20).map((h, i) => {
                      const tool = ALL_TOOLS.find(t => t.id === h.id)
                      if (!tool) return null
                      const maxCount = history[0]?.count || 1
                      return (
                        <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.75rem', background: 'var(--bg3)', borderRadius: 9, border: '1px solid var(--border)' }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)', minWidth: 18 }}>#{i + 1}</span>
                          <span style={{ width: 20, height: 20, borderRadius: 6, background: tool.color + '1a', color: tool.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{tool.icon}</span>
                          <span style={{ flex: 1, fontSize: 13, color: 'var(--text)' }}>{tool.label}</span>
                          <div style={{ width: 80, height: 4, background: 'var(--bg4)', borderRadius: 99 }}>
                            <div style={{ width: `${(h.count / maxCount) * 100}%`, height: '100%', background: tool.color, borderRadius: 99 }} />
                          </div>
                          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text3)', minWidth: 28, textAlign: 'right' }}>{h.count}×</span>
                          <span style={{ fontSize: 10, color: 'var(--text3)' }}>{new Date(h.lastUsed).toLocaleDateString()}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </Section>

              {history.length > 0 && (
                <button onClick={() => { localStorage.removeItem('cl-history'); showToast('History cleared'); setModal(null) }}
                  style={{ fontSize: 12, color: 'var(--accent2)', background: 'none', border: '1px solid var(--accent2)33', borderRadius: 8, padding: '0.4rem 0.85rem', cursor: 'pointer', fontFamily: 'var(--sans)' }}>
                  Clear history
                </button>
              )}
            </div>
          )}

          {/* ── PRESETS ── */}
          {tab === 'presets' && (
            <div>
              <Section title="Export Presets">
                <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: '0.75rem', lineHeight: 1.6 }}>
                  Export your theme, colours, font, and favourites to a <code style={{ fontFamily: 'var(--mono)', fontSize: 12, background: 'var(--bg3)', padding: '1px 5px', borderRadius: 4 }}>.json</code> file. Share it across devices or back it up.
                </div>
                <button onClick={exportPresets} style={{ padding: '0.55rem 1.1rem', borderRadius: 9, border: 'none', background: 'var(--accent)', color: '#fff', fontFamily: 'var(--sans)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                  ⬇ Export presets.json
                </button>
              </Section>

              <Section title="Import Presets">
                <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: '0.75rem', lineHeight: 1.6 }}>
                  Import a previously exported preset file to restore your settings.
                </div>
                <input ref={importRef} type="file" accept=".json" style={{ display: 'none' }} onChange={e => { if (e.target.files[0]) { importPresets(e.target.files[0]); e.target.value = '' } }} />
                <button onClick={() => importRef.current?.click()} style={{ padding: '0.55rem 1.1rem', borderRadius: 9, border: '1px solid var(--border2)', background: 'transparent', color: 'var(--text)', fontFamily: 'var(--sans)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                  ⬆ Import presets.json
                </button>
              </Section>

              <Section title="Reset Everything">
                <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: '0.75rem' }}>Reset all settings to defaults. This cannot be undone.</div>
                <button onClick={() => {
                  ['cl-theme','cl-profile','cl-profile-hash','cl-favs','cl-history','cl-sidebar','cl-notifs'].forEach(k => localStorage.removeItem(k))
                  showToast('All settings reset — reloading…', 'warn')
                  setTimeout(() => window.location.reload(), 1200)
                }} style={{ padding: '0.55rem 1.1rem', borderRadius: 9, border: '1px solid var(--accent2)44', background: 'transparent', color: 'var(--accent2)', fontFamily: 'var(--sans)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                  ↺ Reset to defaults
                </button>
              </Section>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
