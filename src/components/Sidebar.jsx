import { useState } from 'react'
import { TOOLS, ALL_TOOLS } from '../tools/registry'
import { useApp } from '../context/AppContext'

function StarBtn({ toolId }) {
  const { favourites, toggleFav } = useApp()
  const isFav = favourites.includes(toolId)
  return (
    <button
      className={`star-btn${isFav ? ' active' : ''}`}
      onClick={e => { e.stopPropagation(); toggleFav(toolId) }}
      title={isFav ? 'Remove from favourites' : 'Add to favourites'}
    >
      {isFav ? '★' : '☆'}
    </button>
  )
}

export default function Sidebar({ activeTool, setActiveTool }) {
  const { sidebarOpen, setSidebarOpen, favourites, theme, toggleTheme, setModal } = useApp()
  const [search, setSearch] = useState('')

  const q = search.toLowerCase().trim()

  // Build filtered groups — always show Favourites first if any
  const favTools = favourites.map(id => ALL_TOOLS.find(t => t.id === id)).filter(Boolean)

  const filteredGroups = [
    ...(favTools.length > 0 && !q ? [{ section: 'Favourites', items: favTools, isFav: true }] : []),
    ...TOOLS.map(g => ({
      ...g,
      items: q ? g.items.filter(t => t.label.toLowerCase().includes(q) || t.id.includes(q)) : g.items,
    })).filter(g => g.items.length > 0),
  ]

  const ToolBtn = ({ tool }) => {
    const active = activeTool === tool.id
    return (
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.44rem 0.85rem 0.44rem 1rem',
          borderLeft: `2px solid ${active ? 'var(--accent)' : 'transparent'}`,
          background: active ? 'var(--bg3)' : 'transparent',
          cursor: 'pointer', transition: 'all 0.1s',
          color: active ? 'var(--text)' : 'var(--text2)',
          fontSize: 12.5,
          userSelect: 'none',
        }}
        onClick={() => setActiveTool(tool.id)}
        onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--bg2)'; e.currentTarget.style.color = 'var(--text)' } }}
        onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text2)' } }}
      >
        {/* Icon */}
        <span style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, background: tool.color + '1a', color: tool.color }}>
          {tool.icon}
        </span>
        {/* Label */}
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tool.label}</span>
        {/* Star */}
        <StarBtn toolId={tool.id} />
      </div>
    )
  }

  return (
    <>
      {/* Collapsed toggle tab */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          title="Open sidebar"
          style={{
            position: 'fixed', left: 0, top: '50%', transform: 'translateY(-50%)',
            zIndex: 50,
            width: 20, height: 56,
            background: 'var(--bg3)',
            border: '1px solid var(--border2)',
            borderLeft: 'none',
            borderRadius: '0 8px 8px 0',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text3)',
            fontSize: 10,
            boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
          }}
        >›</button>
      )}

      {/* Sidebar */}
      <div className={`sidebar-wrap${sidebarOpen ? '' : ' collapsed'}`}
        style={{ borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)', '--sidebar-w': '224px' }}>

        {/* Top controls */}
        <div style={{ padding: '0.55rem 0.75rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '0.4rem', alignItems: 'center', flexShrink: 0 }}>
          {/* Search */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.28rem 0.6rem' }}>
            <span style={{ color: 'var(--text3)', fontSize: 12, lineHeight: 1, flexShrink: 0 }}>⌕</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tools…"
              style={{ background: 'none', border: 'none', outline: 'none', fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--text)', width: '100%', padding: 0 }} />
            {search && <span onClick={() => setSearch('')} style={{ cursor: 'pointer', color: 'var(--text3)', fontSize: 11, flexShrink: 0 }}>✕</span>}
          </div>

          {/* Collapse */}
          <button onClick={() => setSidebarOpen(false)} title="Collapse sidebar"
            style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 7, cursor: 'pointer', color: 'var(--text3)', fontSize: 12, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--border2)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text3)'; e.currentTarget.style.borderColor = 'var(--border)' }}>
            ‹
          </button>
        </div>

        {/* Tool list */}
        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '0.5rem' }}>
          {filteredGroups.length === 0 && q && (
            <div style={{ padding: '1.25rem 1rem', fontSize: 12, color: 'var(--text3)' }}>No tools match "<em>{q}</em>"</div>
          )}

          {filteredGroups.map(group => (
            <div key={group.section}>
              {/* Section label */}
              <div style={{ padding: '0.7rem 1rem 0.25rem', fontSize: 9.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: group.isFav ? 'var(--accent4)' : 'var(--text3)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {group.isFav && '★ '}{group.section}
              </div>
              {group.items.map(tool => <ToolBtn key={tool.id + group.section} tool={tool} />)}
            </div>
          ))}
        </div>

        {/* Bottom actions */}
        <div style={{ borderTop: '1px solid var(--border)', padding: '0.6rem 0.75rem', display: 'flex', gap: '0.4rem', flexShrink: 0, flexWrap: 'wrap' }}>
          {[
            { icon: theme === 'dark' ? '☀️' : '🌙', title: 'Toggle theme', action: toggleTheme },
            { icon: '💬', title: 'Send feedback', action: () => setModal('feedback') },
            { icon: 'ℹ', title: 'About ConvertLab', action: () => setModal('about') },
            { icon: '☕', title: 'Buy me a coffee', action: () => setModal('coffee') },
          ].map(({ icon, title, action }) => (
            <button key={title} onClick={action} title={title}
              style={{ flex: 1, minWidth: 32, height: 32, borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text2)', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg3)'; e.currentTarget.style.color = 'var(--text)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text2)' }}>
              {icon}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
