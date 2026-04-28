import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import { ALL_TOOLS } from '../tools/registry'

export const SHORTCUTS = [
  { keys: ['⌘', 'K'],       desc: 'Search tools' },
  { keys: ['?'],              desc: 'Show keyboard shortcuts' },
  { keys: ['1', '–', '9'],   desc: 'Jump to tool by sidebar position' },
  { keys: ['⌘', 'B'],       desc: 'Toggle sidebar open/close' },
  { keys: ['⌘', 'D'],       desc: 'Toggle dark / light mode' },
  { keys: ['⌘', ','],       desc: 'Open settings / profile' },
  { keys: ['⌘', '⇧', 'F'], desc: 'Favourite the current tool' },
  { keys: ['Esc'],            desc: 'Close modals / clear search' },
]

export function useKeyboardShortcuts({ setActiveTool, activeTool, setSearchOpen, setShortcutsOpen }) {
  const { toggleTheme, setSidebarOpen, setModal, toggleFav, showToast } = useApp()

  useEffect(() => {
    const handler = (e) => {
      const tag = document.activeElement?.tagName
      const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)

      if (e.key === 'Escape') { setShortcutsOpen(false); return }

      if (e.key === '?' && !isTyping) { e.preventDefault(); setShortcutsOpen(v => !v); return }

      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault(); setSearchOpen(true); return
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault(); setSidebarOpen(v => !v); return
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
        e.preventDefault(); toggleTheme(); return
      }

      if ((e.metaKey || e.ctrlKey) && e.key === ',') {
        e.preventDefault(); setModal('profile'); return
      }

      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'f') {
        e.preventDefault()
        if (activeTool) {
          toggleFav(activeTool)
          const tool = ALL_TOOLS.find(t => t.id === activeTool)
          showToast((tool?.label || activeTool) + ' favourited ★', 'success')
        }
        return
      }

      // 1–9 jump to tool
      if (!isTyping && !e.metaKey && !e.ctrlKey && !e.altKey && e.key >= '1' && e.key <= '9') {
        const idx = parseInt(e.key) - 1
        if (idx < ALL_TOOLS.length) setActiveTool(ALL_TOOLS[idx].id)
        return
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [activeTool, toggleTheme, setSidebarOpen, setModal, toggleFav, showToast, setSearchOpen, setShortcutsOpen, setActiveTool])
}

export function ShortcutsModal({ open, onClose }) {
  if (!open) return null

  const Kbd = ({ children }) => (
    <kbd style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 7px', background: 'var(--bg4)', border: '1px solid var(--border2)', borderBottom: '2px solid var(--border3)', borderRadius: 6, fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text)' }}>
      {children}
    </kbd>
  )

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" style={{ width: '100%', maxWidth: 440 }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '1rem' }}>⌨️ Keyboard Shortcuts</span>
          <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', fontSize: 18, lineHeight: 1 }}>✕</button>
        </div>
        <div style={{ padding: '1.1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {SHORTCUTS.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.55rem 0.75rem', borderRadius: 8, background: i % 2 === 0 ? 'var(--bg3)' : 'transparent' }}>
              <span style={{ fontSize: 13, color: 'var(--text2)' }}>{s.desc}</span>
              <div style={{ display: 'flex', gap: 3, alignItems: 'center', flexShrink: 0 }}>
                {s.keys.map((k, j) => (
                  <span key={j} style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {j > 0 && k !== '–' && <span style={{ color: 'var(--text3)', fontSize: 10, margin: '0 1px' }}>+</span>}
                    {k === '–' ? <span style={{ color: 'var(--text3)', fontSize: 12, margin: '0 2px' }}>–</span> : <Kbd>{k}</Kbd>}
                  </span>
                ))}
              </div>
            </div>
          ))}
          <div style={{ marginTop: 8, padding: '0.75rem', background: 'rgba(124,109,255,0.06)', borderRadius: 10, border: '1px solid rgba(124,109,255,0.15)', fontSize: 12, color: 'var(--text2)', lineHeight: 1.65 }}>
            💡 Press <Kbd>?</Kbd> anytime to toggle this panel. Press <Kbd>Esc</Kbd> to dismiss any modal.
          </div>
        </div>
      </div>
    </div>
  )
}
