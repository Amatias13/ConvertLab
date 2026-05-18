import { useState, useMemo } from 'react'
import { ToolHeader, PanelLabel } from '../components/UI'

export default function RegexTool() {
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState('gi')
  const [text, setText] = useState('')

  const { matches, highlighted } = useMemo(() => {
    if (!pattern || !text) return { matches: [], highlighted: text }
    try {
      const re = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g')
      const ms = [...text.matchAll(re)]
      let last = 0
      const parts = []
      ms.forEach(m => {
        if (m.index > last) parts.push({ text: text.slice(last, m.index), match: false })
        parts.push({ text: m[0], match: true })
        last = m.index + m[0].length
      })
      if (last < text.length) parts.push({ text: text.slice(last), match: false })
      return { matches: ms, highlighted: parts }
    } catch {
      return { matches: [], highlighted: [{ text, match: false }] }
    }
  }, [pattern, flags, text])

  const isArr = Array.isArray(highlighted)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <ToolHeader title="Regex Tester" desc="Test regular expressions with live highlighting" />

      <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 4, background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 8, padding: '0.4rem 0.75rem' }}>
          <span style={{ color: 'var(--accent2)', fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 500 }}>/</span>
          <input value={pattern} onChange={e => setPattern(e.target.value)} placeholder="pattern"
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: 'var(--mono)', fontSize: 14, color: 'var(--text)', padding: 0, width: '100%' }} />
          <span style={{ color: 'var(--accent2)', fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 500 }}>/</span>
          <input value={flags} onChange={e => setFlags(e.target.value)}
            style={{ width: 36, background: 'transparent', border: 'none', outline: 'none', fontFamily: 'var(--mono)', fontSize: 14, color: 'var(--accent4)', padding: 0 }} />
        </div>
        <span style={{ fontSize: 11, color: matches.length ? 'var(--accent3)' : 'var(--text3)', whiteSpace: 'nowrap' }}>
          {pattern ? `${matches.length} match${matches.length !== 1 ? 'es' : ''}` : ''}
        </span>
      </div>

      <PanelLabel>Test string</PanelLabel>
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, padding: '0.9rem 1rem', fontFamily: 'var(--mono)', fontSize: 12.5, lineHeight: 1.75, whiteSpace: 'pre-wrap', wordBreak: 'break-all', pointerEvents: 'none', zIndex: 1, color: 'var(--text2)' }}>
          {isArr ? highlighted.map((p, i) => p.match
            ? <mark key={i} style={{ background: 'rgba(124,109,255,0.28)', color: 'var(--text)', borderRadius: 2 }}>{p.text}</mark>
            : <span key={i}>{p.text}</span>
          ) : text}
        </div>
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Type or paste text to test regex against..."
          style={{ position: 'absolute', inset: 0, padding: '0.9rem 1rem', fontFamily: 'var(--mono)', fontSize: 12.5, lineHeight: 1.75, background: 'transparent', border: 'none', outline: 'none', resize: 'none', color: 'transparent', caretColor: 'var(--text)', zIndex: 2, width: '100%', height: '100%' }} />
      </div>

      <div style={{ borderTop: '1px solid var(--border)', height: 130, overflow: 'auto', padding: '0.75rem 1rem', fontFamily: 'var(--mono)', fontSize: 12 }}>
        {matches.length === 0
          ? <span style={{ color: 'var(--text3)' }}>Enter a pattern and text to see matches</span>
          : matches.map((m, i) => (
            <div key={i} style={{ marginBottom: 2 }}>
              <span style={{ color: 'var(--text3)', marginRight: 8 }}>[{i + 1}]</span>
              <mark style={{ background: 'rgba(124,109,255,0.22)', color: 'var(--text)', borderRadius: 3, padding: '1px 4px' }}>{m[0]}</mark>
              <span style={{ color: 'var(--text3)', fontSize: 10, marginLeft: 8 }}>@{m.index}</span>
              {m.length > 1 && m.slice(1).map((g, gi) => g !== undefined && (
                <span key={gi} style={{ marginLeft: 6, color: 'var(--accent4)', fontSize: 10 }}>g{gi + 1}: {g}</span>
              ))}
            </div>
          ))}
      </div>
    </div>
  )
}
