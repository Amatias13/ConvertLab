import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { TOOL_META } from '../tools/toolMeta'
import { ALL_TOOLS } from '../tools/registry'

// Components
import Tab from './Tab'
import ExtLink from './ExtLink'
import Icon from './Icon'
import Global from './AboutModal/Global'



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
          {tab === 'project' ? <Global /> : <ToolAbout toolId={toolId} />}
        </div>
      </div>
    </div>
  )
}
