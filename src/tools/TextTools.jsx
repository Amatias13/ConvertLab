import { useState, useMemo } from 'react'
import { ToolHeader, Panels, Panel0, Panel, PanelLabel, OptionsBar, OptLabel, OptGroup, OptBtn, Btn, CodeArea } from '../components/UI'

export function EmailTool() {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [format, setFormat] = useState('text')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <ToolHeader title="Email Preview" desc="Preview how your email will look" />

      <Panels>
        <Panel0 style={{ maxWidth: 320 }}>
          <PanelLabel>Email fields</PanelLabel>
          <div style={{ flex: 1, overflow: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[['From', from, setFrom], ['To', to, setTo], ['Subject', subject, setSubject]].map(([label, val, setter]) => (
              <div key={label}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 4 }}>{label}</div>
                <input type="text" value={val} onChange={e => setter(e.target.value)} placeholder={`${label.toLowerCase()}@example.com`} />
              </div>
            ))}
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 4 }}>Body</div>
              <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Email body..." rows={8} style={{ resize: 'none' }} />
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 6 }}>Format</div>
              <OptGroup>
                <OptBtn active={format === 'text'} onClick={() => setFormat('text')}>Plain text</OptBtn>
                <OptBtn active={format === 'html'} onClick={() => setFormat('html')}>HTML</OptBtn>
              </OptGroup>
            </div>
          </div>
        </Panel0>

        <Panel>
          <PanelLabel>Preview</PanelLabel>
          <div style={{ flex: 1, overflow: 'auto', padding: '1.5rem' }}>
            <div style={{ maxWidth: 600, margin: '0 auto', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', fontFamily: 'var(--sans)' }}>
              <div style={{ background: 'var(--bg3)', padding: '0.85rem 1rem', borderBottom: '1px solid var(--border)' }}>
                {[['From', from || '—'], ['To', to || '—']].map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', gap: '0.5rem', fontSize: 12, marginBottom: 2 }}>
                    <span style={{ color: 'var(--text3)', minWidth: 38 }}>{l}:</span>
                    <span style={{ color: 'var(--text2)' }}>{v}</span>
                  </div>
                ))}
                <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)', marginTop: 6 }}>{subject || 'No subject'}</div>
              </div>
              <div style={{ background: 'var(--bg)', padding: '1.5rem', minHeight: 200, fontSize: 14, lineHeight: 1.7, color: 'var(--text2)', whiteSpace: format === 'text' ? 'pre-wrap' : 'normal' }}>
                {format === 'html' ? <div dangerouslySetInnerHTML={{ __html: body }} /> : body || <span style={{ color: 'var(--text3)' }}>Email body will appear here...</span>}
              </div>
            </div>
          </div>
        </Panel>
      </Panels>
    </div>
  )
}

// RegexTool
export function RegexTool() {
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
          <input
            value={pattern}
            onChange={e => setPattern(e.target.value)}
            placeholder="pattern"
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: 'var(--mono)', fontSize: 14, color: 'var(--text)', padding: 0, width: '100%' }}
          />
          <span style={{ color: 'var(--accent2)', fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 500 }}>/</span>
          <input
            value={flags}
            onChange={e => setFlags(e.target.value)}
            style={{ width: 36, background: 'transparent', border: 'none', outline: 'none', fontFamily: 'var(--mono)', fontSize: 14, color: 'var(--accent4)', padding: 0 }}
          />
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
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type or paste text to test regex against..."
          style={{ position: 'absolute', inset: 0, padding: '0.9rem 1rem', fontFamily: 'var(--mono)', fontSize: 12.5, lineHeight: 1.75, background: 'transparent', border: 'none', outline: 'none', resize: 'none', color: 'transparent', caretColor: 'var(--text)', zIndex: 2, width: '100%', height: '100%' }}
        />
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

// DiffTool
export function DiffTool() {
  const [a, setA] = useState('')
  const [b, setB] = useState('')

  const diff = useMemo(() => {
    if (!a && !b) return []
    const la = a.split('\n'), lb = b.split('\n')
    const m = la.length, n = lb.length
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
    for (let i = m - 1; i >= 0; i--) for (let j = n - 1; j >= 0; j--) {
      dp[i][j] = la[i] === lb[j] ? dp[i+1][j+1] + 1 : Math.max(dp[i+1][j], dp[i][j+1])
    }
    const res = []; let i = 0, j = 0
    while (i < m || j < n) {
      if (i < m && j < n && la[i] === lb[j]) { res.push({ t: '=', v: la[i] }); i++; j++ }
      else if (j < n && (i >= m || dp[i+1] && dp[i][j+1] >= dp[i+1][j])) { res.push({ t: '+', v: lb[j] }); j++ }
      else { res.push({ t: '-', v: la[i] }); i++ }
    }
    return res
  }, [a, b])

  const adds = diff.filter(d => d.t === '+').length
  const dels = diff.filter(d => d.t === '-').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <ToolHeader title="Text Diff" desc="Compare two texts and see line-by-line differences" />
      <Panels style={{ flex: '0 0 45%', minHeight: 140 }}>
        <Panel0>
          <PanelLabel>Original (A)</PanelLabel>
          <CodeArea value={a} onChange={setA} placeholder="Original text..." mono={false} />
        </Panel0>
        <Panel>
          <PanelLabel>Modified (B)</PanelLabel>
          <CodeArea value={b} onChange={setB} placeholder="Modified text..." mono={false} />
        </Panel>
      </Panels>
      <div style={{ borderTop: '1px solid var(--border)', padding: '0.45rem 1rem', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        Diff result
        {diff.length > 0 && <>
          <span style={{ color: 'var(--accent3)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>+{adds}</span>
          <span style={{ color: 'var(--accent2)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>−{dels}</span>
        </>}
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '0.75rem 1rem', fontFamily: 'var(--mono)', fontSize: 12.5, lineHeight: 1.8 }}>
        {diff.length === 0
          ? <span style={{ color: 'var(--text3)' }}>Type in both fields to see the diff</span>
          : diff.map((d, i) => (
            <span key={i} style={{
              display: 'block', padding: '0 0.4rem', borderRadius: 3,
              background: d.t === '+' ? 'rgba(63,232,160,0.07)' : d.t === '-' ? 'rgba(255,95,126,0.07)' : 'transparent',
              color: d.t === '+' ? 'var(--accent3)' : d.t === '-' ? 'var(--accent2)' : 'var(--text3)',
            }}>
              {d.t === '+' ? '+ ' : d.t === '-' ? '- ' : '  '}{d.v}
            </span>
          ))}
      </div>
    </div>
  )
}

// CaseTool
export function CaseTool({ showToast }) {
  const [input, setInput] = useState('')

  const words = input.trim().replace(/[_-]/g, ' ').split(/\s+/).filter(Boolean)

  const cases = input.trim() ? [
    { name: 'UPPERCASE',      val: input.toUpperCase() },
    { name: 'lowercase',      val: input.toLowerCase() },
    { name: 'Title Case',     val: words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ') },
    { name: 'Sentence case',  val: input.charAt(0).toUpperCase() + input.slice(1).toLowerCase() },
    { name: 'camelCase',      val: words.map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('') },
    { name: 'PascalCase',     val: words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('') },
    { name: 'snake_case',     val: words.map(w => w.toLowerCase()).join('_') },
    { name: 'SCREAMING_SNAKE',val: words.map(w => w.toUpperCase()).join('_') },
    { name: 'kebab-case',     val: words.map(w => w.toLowerCase()).join('-') },
    { name: 'TRAIN-CASE',     val: words.map(w => w.toUpperCase()).join('-') },
    { name: 'dot.case',       val: words.map(w => w.toLowerCase()).join('.') },
    { name: 'Reversed',       val: input.split('').reverse().join('') },
    { name: 'sPoNgEcAsE',     val: input.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('') },
  ] : []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <ToolHeader title="Case Converter" desc="Transform text between different naming conventions" />
      <Panels>
        <Panel0 style={{ maxWidth: 320 }}>
          <PanelLabel>Input text</PanelLabel>
          <CodeArea value={input} onChange={setInput} placeholder={'Type or paste text...\n\nhello world foo bar'} mono={false} />
        </Panel0>
        <Panel>
          <PanelLabel>All conversions — click any to copy</PanelLabel>
          <div style={{ flex: 1, overflow: 'auto', padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {cases.length === 0
              ? <div style={{ fontSize: 12, color: 'var(--text3)' }}>Type text to see all case conversions</div>
              : cases.map(c => (
                <div
                  key={c.name}
                  onClick={() => { navigator.clipboard.writeText(c.val); showToast('Copied: ' + c.name) }}
                  style={{
                    display: 'flex', alignItems: 'baseline', gap: '0.75rem',
                    padding: '0.5rem 0.75rem',
                    background: 'var(--bg2)',
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                    cursor: 'pointer',
                    transition: 'border-color 0.12s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border3)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)', minWidth: 108 }}>{c.name}</span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 12.5, color: 'var(--text)', wordBreak: 'break-all', flex: 1 }}>{c.val}</span>
                  <span style={{ fontSize: 10, color: 'var(--text3)', flexShrink: 0 }}>copy</span>
                </div>
              ))}
          </div>
        </Panel>
      </Panels>
    </div>
  )
}
