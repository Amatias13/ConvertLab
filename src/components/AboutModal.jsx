import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { TOOL_META } from '../tools/toolMeta'
import { ALL_TOOLS } from '../tools/registry'

function Tab({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{ padding: '0.45rem 0.9rem', border: 'none', borderRadius: 8, background: active ? 'var(--accent)' : 'transparent', color: active ? '#fff' : 'var(--text2)', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--sans)', transition: 'all 0.15s' }}>
      {children}
    </button>
  )
}

function ExtLink({ href, children }) {
  return <a href={href} target="_blank" rel="noreferrer" style={{ color: 'var(--accent5)', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'} onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}>{children} ↗</a>
}

function AboutGlobal() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2rem' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 14px var(--accent)', display: 'inline-block', animation: 'pulse 2s ease-in-out infinite' }} />
          <span style={{ fontFamily: 'var(--display)', fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.02em' }}>ConvertLab</span>
        </div>
        <p style={{ fontSize: 14, color: 'var(--text2)', maxWidth: 480, margin: '0 auto', lineHeight: 1.75 }}>
          A free, open-source developer toolkit that runs entirely in your browser. No accounts, no uploads, no servers — every transformation happens locally on your device.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          {['28 Tools', '100% Local', 'Open Source', 'Privacy First', 'PWA Ready', 'Free AI'].map(tag => (
            <span key={tag} style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 100, background: 'var(--accent)1a', color: 'var(--accent)', border: '1px solid var(--accent)33' }}>{tag}</span>
          ))}
        </div>
      </div>

      {/* Goals */}
      <div>
        <h3 style={{ fontFamily: 'var(--display)', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>🎯 Goals</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            ['⚡', 'Speed', 'Every tool responds instantly — no loading, no waiting.'],
            ['🔒', 'Privacy', 'Your data never leaves your browser. Nothing stored on servers.'],
            ['🎨', 'Simplicity', 'Clean, distraction-free UI that gets out of your way.'],
            ['🛠', 'Power', 'Deep functionality for developers, designers, and creators.'],
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ background: 'var(--bg3)', borderRadius: 10, border: '1px solid var(--border)', padding: '0.85rem' }}>
              <div style={{ marginBottom: 4, fontWeight: 600 }}>{icon} {title}</div>
              <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech */}
      <div>
        <h3 style={{ fontFamily: 'var(--display)', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>⚙️ Technologies</h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { name: 'React 19', color: '#61dafb' },
            { name: 'Vite 8', color: '#646cff' },
            { name: 'Pollinations.ai', color: '#3fe8a0' },
            { name: 'Web Crypto API', color: '#ffba3b' },
            { name: 'PWA / Workbox', color: '#ff5f7e' },
            { name: 'GitHub Pages', color: '#8888a8' },
          ].map(t => (
            <div key={t.name} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.4rem 0.8rem', fontSize: 12, fontWeight: 600, color: t.color }}>
              {t.name}
            </div>
          ))}
        </div>
      </div>

      {/* Roadmap */}
      <div>
        <h3 style={{ fontFamily: 'var(--display)', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>🗺 Roadmap</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {[
            { s: 'done', l: 'Dark & Light theme + custom palettes' },
            { s: 'done', l: 'Favourites & sidebar personalisation' },
            { s: 'done', l: 'AI Text Enhancer (Pollinations.ai — free)' },
            { s: 'done', l: 'PWA — install & use offline' },
            { s: 'done', l: 'Tool usage history' },
            { s: 'done', l: 'Import/Export settings presets' },
            { s: 'done', l: 'Keyboard shortcut navigator' },
            { s: 'plan', l: 'Browser extension' },
            { s: 'plan', l: 'More AI modes (image, code review)' },
          ].map(item => {
            const col = { done: 'var(--accent3)', wip: 'var(--accent4)', plan: 'var(--text3)' }[item.s]
            const lbl = { done: '✓', wip: '⟳', plan: '◦' }[item.s]
            return (
              <div key={item.l} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: 13 }}>
                <span style={{ color: col, minWidth: 16, fontWeight: 700 }}>{lbl}</span>
                <span style={{ color: item.s === 'plan' ? 'var(--text3)' : 'var(--text2)' }}>{item.l}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Author — André Matias */}
      <div style={{ background: 'var(--bg3)', borderRadius: 14, border: '1px solid var(--border)', padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        <div style={{ width: 54, height: 54, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent2))', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>
          👨‍💻
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 15, fontFamily: 'var(--display)' }}>André Matias</div>
          <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 1 }}>Full Stack Developer · Moita, Setúbal, Portugal 🇵🇹</div>
          <div style={{ fontSize: 12.5, color: 'var(--text2)', marginTop: 8, lineHeight: 1.65 }}>
            Software Engineer at INSTICC and co-founder of Code Lusitan. Passionate about building fast, privacy-first developer tools. Currently expanding into AI development and Cybersecurity.
          </div>
          <div style={{ display: 'flex', gap: '0.85rem', marginTop: '0.85rem', flexWrap: 'wrap', fontSize: 13, alignItems: 'center' }}>
            <ExtLink href="https://github.com/Amatias13">GitHub</ExtLink>
            <ExtLink href="https://www.linkedin.com/in/andre-matias-dev/">LinkedIn</ExtLink>
            <ExtLink href="https://amatias13.github.io/Portfolio/">Portfolio</ExtLink>
            <ExtLink href="https://github.com/Amatias13/convertlab">ConvertLab repo</ExtLink>
            <a href="#" onClick={e => { e.preventDefault(); document.dispatchEvent(new CustomEvent('open-coffee')) }}
              style={{ color: 'var(--accent4)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              ☕ Buy me a coffee
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ToolAbout({ toolId }) {
  const meta = TOOL_META[toolId]
  const tool = ALL_TOOLS.find(t => t.id === toolId)
  const { showToast } = useApp()
  if (!meta || !tool) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.75rem' }}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        <div style={{ width: 46, height: 46, borderRadius: 12, background: tool.color + '1a', color: tool.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, flexShrink: 0 }}>{tool.icon}</div>
        <div>
          <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.1rem', fontWeight: 700 }}>{meta.title}</h2>
          <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>{meta.tagline}</p>
        </div>
      </div>
      <p style={{ fontSize: 13.5, color: 'var(--text2)', lineHeight: 1.75 }}>{meta.description}</p>
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '0.6rem' }}>Common use cases</div>
        <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: 5 }}>
          {meta.useCases.map((u, i) => <li key={i} style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>{u}</li>)}
        </ul>
      </div>
      {meta.examples?.length > 0 && (
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '0.6rem' }}>Try it with</div>
          {meta.examples.map((ex, i) => (
            <div key={i} onClick={() => { navigator.clipboard.writeText(ex.value); showToast('Example copied — paste it in the tool!') }}
              style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.6rem 0.85rem', cursor: 'pointer', marginBottom: 6, transition: 'border-color 0.12s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border3)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text3)', marginBottom: 4 }}>{ex.label}</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ex.value}</div>
              <div style={{ fontSize: 10, color: 'var(--accent5)', marginTop: 4 }}>Click to copy →</div>
            </div>
          ))}
        </div>
      )}
      {meta.tips && (
        <div style={{ background: 'rgba(124,109,255,0.06)', border: '1px solid rgba(124,109,255,0.18)', borderRadius: 10, padding: '0.75rem 1rem', display: 'flex', gap: '0.6rem' }}>
          <span style={{ fontSize: '1rem', flexShrink: 0 }}>💡</span>
          <p style={{ fontSize: 12.5, color: 'var(--text2)', lineHeight: 1.65 }}>{meta.tips}</p>
        </div>
      )}
      {meta.keywords?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {meta.keywords.map(k => (
            <span key={k} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text3)' }}>#{k}</span>
          ))}
        </div>
      )}
    </div>
  )
}

export function AboutModal({ toolId }) {
  const { modal, setModal } = useApp()
  const [tab, setTab] = useState('tool')
  if (modal !== 'about') return null

  return (
    <div className="modal-backdrop" onClick={() => setModal(null)}>
      <div className="modal-box" style={{ width: '100%', maxWidth: 640 }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: 4 }}>
            <Tab active={tab === 'project'} onClick={() => setTab('project')}>About ConvertLab</Tab>
            {toolId && <Tab active={tab === 'tool'} onClick={() => setTab('tool')}>About this tool</Tab>}
          </div>
          <button onClick={() => setModal(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', fontSize: 18 }}>✕</button>
        </div>
        <div style={{ overflow: 'auto', flex: 1 }}>
          {tab === 'project' ? <AboutGlobal /> : <ToolAbout toolId={toolId} />}
        </div>
      </div>
    </div>
  )
}
