import { useState, useCallback } from 'react'

const s = {
  // Layout
  panelLabel: {
    padding: '0.45rem 1rem',
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--text3)',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  // Options bar
  optBar: {
    padding: '0.5rem 1rem',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    gap: '0.6rem',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  optLabel: { fontSize: 11, color: 'var(--text3)', whiteSpace: 'nowrap' },
  optGroup: { display: 'flex', gap: 3 },
}

export function PanelLabel({ children, right }) {
  return (
    <div style={s.panelLabel}>
      {children}
      {right && <span style={{ marginLeft: 'auto', fontWeight: 400, textTransform: 'none', letterSpacing: 0, fontSize: 11 }}>{right}</span>}
    </div>
  )
}

export function OptionsBar({ children }) {
  return <div style={s.optBar}>{children}</div>
}

export function OptLabel({ children }) {
  return <span style={s.optLabel}>{children}</span>
}

export function OptGroup({ children }) {
  return <div style={s.optGroup}>{children}</div>
}

export function OptBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '0.22rem 0.6rem',
        borderRadius: 6,
        border: '1px solid ' + (active ? 'var(--border3)' : 'var(--border)'),
        background: active ? 'var(--bg4)' : 'transparent',
        color: active ? 'var(--text)' : 'var(--text3)',
        fontSize: 11,
        cursor: 'pointer',
        transition: 'all 0.12s',
        fontFamily: 'var(--sans)',
      }}
    >
      {children}
    </button>
  )
}

export function Btn({ onClick, primary, children, style }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '0.4rem 0.9rem',
        borderRadius: 8,
        border: primary ? '1px solid var(--accent)' : '1px solid var(--border2)',
        background: primary ? 'var(--accent)' : 'transparent',
        color: primary ? '#fff' : 'var(--text2)',
        fontSize: 12,
        cursor: 'pointer',
        fontFamily: 'var(--sans)',
        transition: 'all 0.15s',
        ...style,
      }}
    >
      {children}
    </button>
  )
}

export function ToolHeader({ title, desc, children }) {
  return (
    <div style={{
      padding: '1.1rem 1.5rem 1rem',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    }}>
      <div>
        <div style={{ fontFamily: 'var(--display)', fontSize: '1.05rem', fontWeight: 700 }}>{title}</div>
        <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{desc}</div>
      </div>
      {children && <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>{children}</div>}
    </div>
  )
}

export function Panels({ children }) {
  return <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>{children}</div>
}

export function Panel({ children, maxWidth, minWidth, style }) {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      borderLeft: '1px solid var(--border)',
      maxWidth,
      minWidth,
      ...style,
    }}>
      {children}
    </div>
  )
}

export function Panel0({ children, style }) {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      ...style,
    }}>
      {children}
    </div>
  )
}

export function CodeArea({ value, onChange, placeholder, readOnly, mono }) {
  return (
    <textarea
      value={value}
      onChange={onChange ? e => onChange(e.target.value) : undefined}
      placeholder={placeholder}
      readOnly={readOnly}
      style={{
        flex: 1,
        padding: '0.9rem 1rem',
        fontFamily: mono !== false ? 'var(--mono)' : 'var(--sans)',
        fontSize: 12.5,
        lineHeight: 1.75,
        background: 'transparent',
        border: 'none',
        outline: 'none',
        resize: 'none',
        color: 'var(--text)',
        width: '100%',
        height: '100%',
      }}
    />
  )
}

export function StatusBadge({ type, children }) {
  const colors = {
    ok: 'var(--accent3)',
    err: 'var(--accent2)',
    warn: 'var(--accent4)',
    info: 'var(--accent5)',
  }
  return <span style={{ color: colors[type] || 'var(--text3)', fontSize: 11 }}>{children}</span>
}

export function useToast() {
  const [toast, setToast] = useState(null)
  const show = useCallback((msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2000)
  }, [])
  return { toast, show }
}

export function Toast({ message }) {
  if (!message) return null
  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      padding: '0.55rem 1rem',
      background: 'var(--bg3)',
      border: '1px solid var(--border2)',
      borderRadius: 10,
      fontSize: 12,
      color: 'var(--text)',
      zIndex: 9999,
      pointerEvents: 'none',
      animation: 'fadeIn 0.2s ease',
    }}>
      {message}
    </div>
  )
}

export function InfoRow({ label, value, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        gap: '0.75rem',
        alignItems: 'baseline',
        padding: '0.5rem 0.75rem',
        background: 'var(--bg3)',
        borderRadius: 8,
        border: '1px solid var(--border)',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', minWidth: 90 }}>{label}</span>
      <span style={{ fontFamily: 'var(--mono)', fontSize: 11.5, color: 'var(--text)', wordBreak: 'break-all', flex: 1 }}>{value}</span>
      {onClick && <span style={{ fontSize: 10, color: 'var(--text3)', flexShrink: 0 }}>copy</span>}
    </div>
  )
}
