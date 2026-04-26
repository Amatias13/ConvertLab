import { useState, useMemo, useEffect, useCallback } from 'react'
import {
  ToolHeader, Panels, Panel0, Panel, PanelLabel,
  OptionsBar, OptLabel, OptGroup, OptBtn, Btn, CodeArea, StatusBadge
} from '../components/UI'

// ─── SQL Formatter ────────────────────────────────────────────────
const SQL_KEYWORDS = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN', 'FULL JOIN', 'ON', 'AND', 'OR', 'NOT', 'IN', 'EXISTS', 'IS NULL', 'IS NOT NULL', 'LIKE', 'BETWEEN', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET', 'UNION', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE', 'INDEX', 'DISTINCT', 'AS', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'WITH', 'RETURNS', 'DECLARE']

function formatSQL(sql, indent = 2) {
  const pad = ' '.repeat(indent)
  let result = sql.trim()
  // Uppercase keywords
  SQL_KEYWORDS.forEach(kw => {
    result = result.replace(new RegExp(`\\b${kw}\\b`, 'gi'), kw)
  })
  // Add newlines before major clauses
  const clauses = ['SELECT', 'FROM', 'WHERE', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN', 'FULL JOIN', 'JOIN', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET', 'UNION ALL', 'UNION', 'INSERT INTO', 'VALUES', 'SET', 'ON']
  clauses.forEach(c => {
    result = result.replace(new RegExp(`\\s+${c}\\b`, 'g'), `\n${c}`)
  })
  // Indent columns after SELECT
  result = result.replace(/SELECT\s+/g, 'SELECT\n' + pad)
  result = result.replace(/,\s*(?=[^\n])/g, ',\n' + pad)
  // Clean up extra spaces
  result = result.replace(/\n{3,}/g, '\n\n').trim()
  return result
}

function minifySQL(sql) {
  return sql.replace(/\s+/g, ' ').trim()
}

function highlightSQL(sql) {
  const kwPattern = SQL_KEYWORDS.map(k => k.replace(/\s+/g, '\\s+')).join('|')
  const re = new RegExp(`\\b(${kwPattern})\\b`, 'gi')
  return sql
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/'([^']*)'/g, '<span style="color:var(--accent3)">\'$1\'</span>')
    .replace(/`([^`]*)`/g, '<span style="color:var(--accent4)">`$1`</span>')
    .replace(/--[^\n]*/g, '<span style="color:var(--text3)">$&</span>')
    .replace(re, '<span style="color:var(--accent5);font-weight:600">$1</span>')
    .replace(/\b(\d+)\b/g, '<span style="color:var(--accent4)">$1</span>')
}

export function SqlTool({ showToast }) {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [indent, setIndent] = useState(2)
  const [mode, setMode] = useState('highlight') // highlight | formatted

  const highlighted = useMemo(() => highlightSQL(output || input), [output, input])

  const format = () => { setOutput(formatSQL(input, indent)); setMode('formatted') }
  const minify = () => { setOutput(minifySQL(input)); setMode('formatted') }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <ToolHeader title="SQL Formatter" desc="Format, minify and syntax-highlight SQL queries">
        <Btn onClick={minify}>Minify</Btn>
        <Btn primary onClick={format}>Format</Btn>
      </ToolHeader>

      <OptionsBar>
        <OptLabel>Indent:</OptLabel>
        <OptGroup>
          {[2, 4].map(v => <OptBtn key={v} active={indent === v} onClick={() => setIndent(v)}>{v}</OptBtn>)}
        </OptGroup>
        <OptLabel style={{ marginLeft: '0.75rem' }}>View:</OptLabel>
        <OptGroup>
          <OptBtn active={mode === 'highlight'} onClick={() => setMode('highlight')}>Highlighted</OptBtn>
          <OptBtn active={mode === 'formatted'} onClick={() => setMode('formatted')}>Plain</OptBtn>
        </OptGroup>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          <Btn onClick={() => { navigator.clipboard.writeText(output || input); showToast('Copied') }}>Copy</Btn>
          <Btn onClick={() => { setInput(''); setOutput('') }}>Clear</Btn>
        </div>
      </OptionsBar>

      <Panels>
        <Panel0>
          <PanelLabel>SQL Input</PanelLabel>
          <CodeArea value={input} onChange={v => { setInput(v); setOutput('') }} placeholder={'SELECT u.id, u.name, COUNT(o.id) AS orders\nFROM users u LEFT JOIN orders o ON u.id = o.user_id\nWHERE u.active = 1 GROUP BY u.id ORDER BY orders DESC LIMIT 10'} />
        </Panel0>
        <Panel>
          <PanelLabel>Output</PanelLabel>
          {mode === 'highlight' ? (
            <div style={{ flex: 1, overflow: 'auto', padding: '0.9rem 1rem', fontFamily: 'var(--mono)', fontSize: 12.5, lineHeight: 1.75, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
              dangerouslySetInnerHTML={{ __html: highlighted }} />
          ) : (
            <CodeArea value={output} readOnly placeholder="Formatted SQL will appear here..." />
          )}
        </Panel>
      </Panels>
    </div>
  )
}

// ─── Password Generator ───────────────────────────────────────────
const CHARSETS = {
  upper:   'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower:   'abcdefghijklmnopqrstuvwxyz',
  digits:  '0123456789',
  symbols: '!@#$%^&*()-_=+[]{}|;:,.<>?',
  similar: 'iIlL1oO0',
}

function genPassword(length, opts) {
  let charset = ''
  if (opts.upper)   charset += CHARSETS.upper
  if (opts.lower)   charset += CHARSETS.lower
  if (opts.digits)  charset += CHARSETS.digits
  if (opts.symbols) charset += CHARSETS.symbols
  if (opts.noSimilar) charset = charset.split('').filter(c => !CHARSETS.similar.includes(c)).join('')
  if (!charset) return ''
  const arr = crypto.getRandomValues(new Uint8Array(length))
  return Array.from(arr).map(b => charset[b % charset.length]).join('')
}

function passwordStrength(pwd) {
  if (!pwd) return { score: 0, label: '', color: '' }
  let score = 0
  if (pwd.length >= 8)  score++
  if (pwd.length >= 12) score++
  if (pwd.length >= 16) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/[a-z]/.test(pwd)) score++
  if (/[0-9]/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++
  const levels = [
    { score: 0, label: 'Too weak',  color: 'var(--accent2)' },
    { score: 2, label: 'Weak',      color: 'var(--accent2)' },
    { score: 4, label: 'Fair',      color: 'var(--accent4)' },
    { score: 5, label: 'Good',      color: 'var(--accent5)' },
    { score: 6, label: 'Strong',    color: 'var(--accent3)' },
    { score: 7, label: 'Very strong', color: 'var(--accent3)' },
  ]
  const level = [...levels].reverse().find(l => score >= l.score) || levels[0]
  return { score, label: level.label, color: level.color, pct: Math.round((score / 7) * 100) }
}

export function PasswordTool({ showToast }) {
  const [length, setLength] = useState(20)
  const [count, setCount] = useState(5)
  const [opts, setOpts] = useState({ upper: true, lower: true, digits: true, symbols: true, noSimilar: false })
  const [passwords, setPasswords] = useState([])

  const generate = useCallback(() => {
    setPasswords(Array.from({ length: count }, () => genPassword(length, opts)))
  }, [length, count, opts])

  useEffect(() => { generate() }, [generate])

  const toggle = (key) => setOpts(prev => ({ ...prev, [key]: !prev[key] }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <ToolHeader title="Password Generator" desc="Generate secure, cryptographically random passwords">
        <Btn primary onClick={generate}>Regenerate</Btn>
      </ToolHeader>

      <OptionsBar>
        <OptLabel>Length: <b style={{ color: 'var(--text)', fontFamily: 'var(--mono)' }}>{length}</b></OptLabel>
        <input type="range" min={6} max={128} value={length} onChange={e => setLength(Number(e.target.value))}
          style={{ width: 120, accentColor: 'var(--accent)' }} />
        <OptLabel style={{ marginLeft: '0.5rem' }}>Count:</OptLabel>
        <OptGroup>
          {[1, 5, 10].map(n => <OptBtn key={n} active={count === n} onClick={() => setCount(n)}>{n}</OptBtn>)}
        </OptGroup>
      </OptionsBar>

      <OptionsBar>
        <OptLabel>Include:</OptLabel>
        {[['upper', 'A–Z'], ['lower', 'a–z'], ['digits', '0–9'], ['symbols', '!@#…'], ['noSimilar', 'No similar']].map(([k, l]) => (
          <OptBtn key={k} active={opts[k]} onClick={() => toggle(k)}>{l}</OptBtn>
        ))}
      </OptionsBar>

      <Panels>
        <Panel0>
          <PanelLabel right={`${count} passwords · ${length} chars each`}>Generated passwords — click to copy</PanelLabel>
          <div style={{ flex: 1, overflow: 'auto', padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {passwords.map((pwd, i) => {
              const str = passwordStrength(pwd)
              return (
                <div key={i}
                  onClick={() => { navigator.clipboard.writeText(pwd); showToast('Password copied!') }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '0.75rem', background: 'var(--bg2)', borderRadius: 10, border: '1px solid var(--border)', cursor: 'pointer', transition: 'border-color 0.12s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border3)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 14, letterSpacing: '0.05em', wordBreak: 'break-all', color: 'var(--text)' }}>{pwd}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 3, background: 'var(--bg4)', borderRadius: 99 }}>
                      <div style={{ width: str.pct + '%', height: '100%', background: str.color, borderRadius: 99, transition: 'all 0.3s' }} />
                    </div>
                    <span style={{ fontSize: 10, color: str.color, minWidth: 70 }}>{str.label}</span>
                    <span style={{ fontSize: 10, color: 'var(--text3)' }}>copy</span>
                  </div>
                </div>
              )
            })}
          </div>
        </Panel0>
      </Panels>
    </div>
  )
}

// ─── Unit Converter ───────────────────────────────────────────────
const UNIT_CATEGORIES = {
  Length: {
    units: ['mm', 'cm', 'm', 'km', 'in', 'ft', 'yd', 'mi', 'nm', 'μm'],
    toBase: { mm: 0.001, cm: 0.01, m: 1, km: 1000, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344, nm: 1e-9, μm: 1e-6 },
  },
  Weight: {
    units: ['mg', 'g', 'kg', 't', 'oz', 'lb', 'st'],
    toBase: { mg: 1e-6, g: 0.001, kg: 1, t: 1000, oz: 0.0283495, lb: 0.453592, st: 6.35029 },
  },
  Temperature: {
    units: ['°C', '°F', 'K'],
    toBase: null, // special handling
  },
  Area: {
    units: ['mm²', 'cm²', 'm²', 'km²', 'in²', 'ft²', 'ac', 'ha'],
    toBase: { 'mm²': 1e-6, 'cm²': 1e-4, 'm²': 1, 'km²': 1e6, 'in²': 6.4516e-4, 'ft²': 0.092903, ac: 4046.86, ha: 10000 },
  },
  Volume: {
    units: ['ml', 'l', 'm³', 'fl oz', 'cup', 'pt', 'qt', 'gal'],
    toBase: { ml: 0.001, l: 1, 'm³': 1000, 'fl oz': 0.0295735, cup: 0.236588, pt: 0.473176, qt: 0.946353, gal: 3.78541 },
  },
  Speed: {
    units: ['m/s', 'km/h', 'mph', 'kn', 'ft/s'],
    toBase: { 'm/s': 1, 'km/h': 0.277778, mph: 0.44704, kn: 0.514444, 'ft/s': 0.3048 },
  },
  Storage: {
    units: ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'KiB', 'MiB', 'GiB', 'TiB'],
    toBase: { B: 1, KB: 1e3, MB: 1e6, GB: 1e9, TB: 1e12, PB: 1e15, KiB: 1024, MiB: 1048576, GiB: 1073741824, TiB: 1099511627776 },
  },
  Time: {
    units: ['ms', 's', 'min', 'h', 'd', 'wk', 'mo', 'yr'],
    toBase: { ms: 0.001, s: 1, min: 60, h: 3600, d: 86400, wk: 604800, mo: 2629746, yr: 31556952 },
  },
}

function convertTemp(val, from, to) {
  let celsius
  if (from === '°C') celsius = val
  else if (from === '°F') celsius = (val - 32) * 5 / 9
  else celsius = val - 273.15
  if (to === '°C') return celsius
  if (to === '°F') return celsius * 9 / 5 + 32
  return celsius + 273.15
}

function convertUnit(val, from, to, cat) {
  if (cat === 'Temperature') return convertTemp(val, from, to)
  const toBase = UNIT_CATEGORIES[cat].toBase
  return (val * toBase[from]) / toBase[to]
}

function fmt(n) {
  if (n === undefined || isNaN(n)) return '—'
  if (Math.abs(n) >= 1e9 || (Math.abs(n) < 1e-4 && n !== 0)) return n.toExponential(6)
  return parseFloat(n.toPrecision(10)).toString()
}

export function UnitConverterTool({ showToast }) {
  const [category, setCategory] = useState('Length')
  const [from, setFrom] = useState('m')
  const [value, setValue] = useState('')

  const cat = UNIT_CATEGORIES[category]

  // When category changes, reset units
  useEffect(() => {
    setFrom(cat.units[0])
    setValue('')
  }, [category])

  const numVal = parseFloat(value)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <ToolHeader title="Unit Converter" desc="Convert between Length, Weight, Temperature, Volume, Speed, Storage, Time" />

      <OptionsBar>
        <OptLabel>Category:</OptLabel>
        <OptGroup style={{ flexWrap: 'wrap' }}>
          {Object.keys(UNIT_CATEGORIES).map(c => (
            <OptBtn key={c} active={category === c} onClick={() => setCategory(c)}>{c}</OptBtn>
          ))}
        </OptGroup>
      </OptionsBar>

      <div style={{ flex: 1, overflow: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Input row */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '1rem' }}>
          <input
            type="number"
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="Enter value..."
            style={{ fontFamily: 'var(--mono)', fontSize: '1.3rem', flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text)', padding: 0 }}
          />
          <select
            value={from}
            onChange={e => setFrom(e.target.value)}
            style={{ fontFamily: 'var(--mono)', fontSize: '1rem', background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 8, color: 'var(--text)', padding: '0.4rem 0.75rem', outline: 'none', cursor: 'pointer' }}
          >
            {cat.units.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>

        {/* Results grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8 }}>
          {cat.units.filter(u => u !== from).map(to => {
            const result = value !== '' && !isNaN(numVal) ? convertUnit(numVal, from, to, category) : null
            return (
              <div key={to}
                onClick={() => { if (result !== null) { navigator.clipboard.writeText(fmt(result)); showToast(`Copied: ${fmt(result)} ${to}`) } }}
                style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: '0.75rem', cursor: result !== null ? 'pointer' : 'default', transition: 'border-color 0.12s' }}
                onMouseEnter={e => { if (result !== null) e.currentTarget.style.borderColor = 'var(--border3)' }}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 4 }}>{to}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '1rem', color: result !== null ? 'var(--text)' : 'var(--text3)' }}>
                  {result !== null ? fmt(result) : '—'}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── HTML Entities ────────────────────────────────────────────────
const ENTITY_MAP = {
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  '©': '&copy;', '®': '&reg;', '™': '&trade;', '€': '&euro;',
  '£': '&pound;', '¥': '&yen;', '¢': '&cent;', '°': '&deg;',
  '±': '&plusmn;', '×': '&times;', '÷': '&divide;', '→': '&rarr;',
  '←': '&larr;', '↑': '&uarr;', '↓': '&darr;', '↔': '&harr;',
  '…': '&hellip;', '—': '&mdash;', '–': '&ndash;', ' ': '&nbsp;',
  '«': '&laquo;', '»': '&raquo;', '•': '&bull;', '‣': '&#8227;',
}
const ENTITY_DECODE_MAP = Object.fromEntries(Object.entries(ENTITY_MAP).map(([k, v]) => [v, k]))

function encodeEntities(text, mode) {
  if (mode === 'named') return text.replace(/[&<>"'©®™€£¥¢°±×÷→←↑↓↔…—–\u00a0«»•‣]/g, c => ENTITY_MAP[c] || c)
  if (mode === 'numeric') return text.split('').map(c => c.charCodeAt(0) > 127 || '&<>"\''.includes(c) ? `&#${c.charCodeAt(0)};` : c).join('')
  return text.replace(/[&<>"']/g, c => ENTITY_MAP[c] || c)
}

function decodeEntities(text) {
  const el = document.createElement('textarea')
  el.innerHTML = text
  return el.value
}

export function HtmlEntitiesTool({ showToast }) {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState('essential') // essential | named | numeric

  const encoded = useMemo(() => encodeEntities(input, mode), [input, mode])
  const decoded = useMemo(() => { try { return decodeEntities(input) } catch { return input } }, [input])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <ToolHeader title="HTML Entities" desc="Encode and decode HTML entities">
        <Btn onClick={() => { navigator.clipboard.writeText(encoded); showToast('Encoded copied') }}>Copy encoded</Btn>
        <Btn primary onClick={() => { navigator.clipboard.writeText(decoded); showToast('Decoded copied') }}>Copy decoded</Btn>
      </ToolHeader>

      <OptionsBar>
        <OptLabel>Encode mode:</OptLabel>
        <OptGroup>
          <OptBtn active={mode === 'essential'} onClick={() => setMode('essential')}>Essential (&lt;&gt;&amp;)</OptBtn>
          <OptBtn active={mode === 'named'} onClick={() => setMode('named')}>Named (&amp;copy;)</OptBtn>
          <OptBtn active={mode === 'numeric'} onClick={() => setMode('numeric')}>Numeric (&amp;#169;)</OptBtn>
        </OptGroup>
      </OptionsBar>

      <Panels>
        <Panel0>
          <PanelLabel>Input</PanelLabel>
          <CodeArea value={input} onChange={setInput} placeholder={'<h1>Hello "World" & friends</h1>\n© 2024 — All rights reserved™'} mono={false} />
        </Panel0>
        <Panel style={{ flexDirection: 'column' }}>
          <PanelLabel right={<span style={{ cursor: 'pointer', color: 'var(--accent5)' }} onClick={() => { navigator.clipboard.writeText(encoded); showToast('Copied') }}>copy</span>}>
            Encoded
          </PanelLabel>
          <div style={{ flex: 1, borderBottom: '1px solid var(--border)', overflow: 'auto' }}>
            <CodeArea value={encoded} readOnly />
          </div>
          <PanelLabel right={<span style={{ cursor: 'pointer', color: 'var(--accent5)' }} onClick={() => { navigator.clipboard.writeText(decoded); showToast('Copied') }}>copy</span>}>
            Decoded
          </PanelLabel>
          <div style={{ flex: 1, overflow: 'auto' }}>
            <CodeArea value={decoded} readOnly />
          </div>
        </Panel>
      </Panels>
    </div>
  )
}

// ─── Number Formatter ─────────────────────────────────────────────
const LOCALES = [
  { label: 'PT (1.234,56)',  locale: 'pt-PT' },
  { label: 'EN (1,234.56)', locale: 'en-US' },
  { label: 'DE (1.234,56)', locale: 'de-DE' },
  { label: 'FR (1 234,56)', locale: 'fr-FR' },
  { label: 'IN (1,23,456)', locale: 'en-IN' },
  { label: 'CH (1\'234.56)',locale: 'de-CH' },
]

function fmtNumber(n, locale, decimals, style) {
  if (isNaN(n)) return '—'
  return new Intl.NumberFormat(locale, {
    style,
    currency: style === 'currency' ? 'EUR' : undefined,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n)
}

export function NumberFormatterTool({ showToast }) {
  const [input, setInput] = useState('')
  const [decimals, setDecimals] = useState(2)
  const [style, setStyle] = useState('decimal')

  const n = parseFloat(input.replace(/[^\d.-]/g, ''))

  const rows = [
    { label: 'Binary',      val: !isNaN(n) && Number.isInteger(n) ? '0b' + Math.abs(n).toString(2) : '—' },
    { label: 'Octal',       val: !isNaN(n) && Number.isInteger(n) ? '0o' + Math.abs(n).toString(8) : '—' },
    { label: 'Hex',         val: !isNaN(n) && Number.isInteger(n) ? '0x' + Math.abs(n).toString(16).toUpperCase() : '—' },
    { label: 'Scientific',  val: !isNaN(n) ? n.toExponential(decimals) : '—' },
    { label: 'Percentage',  val: !isNaN(n) ? (n * 100).toFixed(decimals) + '%' : '—' },
    { label: 'Roman',       val: !isNaN(n) && n > 0 && n < 4000 && Number.isInteger(n) ? toRoman(n) : '—' },
    ...LOCALES.map(l => ({ label: l.label, val: !isNaN(n) ? fmtNumber(n, l.locale, decimals, style) : '—' })),
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <ToolHeader title="Number Formatter" desc="Format numbers in multiple locales, bases, and styles" />

      <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Enter a number..."
          style={{ fontFamily: 'var(--mono)', fontSize: '1.4rem', flex: 1, minWidth: 180 }} />
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <OptLabel>Decimals:</OptLabel>
          <OptGroup>{[0, 1, 2, 3, 4].map(v => <OptBtn key={v} active={decimals === v} onClick={() => setDecimals(v)}>{v}</OptBtn>)}</OptGroup>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <OptLabel>Style:</OptLabel>
          <OptGroup>
            <OptBtn active={style === 'decimal'} onClick={() => setStyle('decimal')}>Number</OptBtn>
            <OptBtn active={style === 'currency'} onClick={() => setStyle('currency')}>Currency (€)</OptBtn>
            <OptBtn active={style === 'percent'} onClick={() => setStyle('percent')}>Percent</OptBtn>
          </OptGroup>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8, alignContent: 'start' }}>
        {rows.map(row => (
          <div key={row.label}
            onClick={() => { if (row.val !== '—') { navigator.clipboard.writeText(row.val); showToast('Copied') } }}
            style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: '0.65rem 0.85rem', cursor: row.val !== '—' ? 'pointer' : 'default', transition: 'border-color 0.12s' }}
            onMouseEnter={e => { if (row.val !== '—') e.currentTarget.style.borderColor = 'var(--border3)' }}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 4 }}>{row.label}</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '1rem', color: row.val !== '—' ? 'var(--text)' : 'var(--text3)' }}>{row.val}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function toRoman(num) {
  const vals = [1000,900,500,400,100,90,50,40,10,9,5,4,1]
  const syms = ['M','CM','D','CD','C','XC','L','XL','X','IX','V','IV','I']
  let res = ''
  vals.forEach((v, i) => { while (num >= v) { res += syms[i]; num -= v } })
  return res
}

// ─── YAML ↔ JSON ──────────────────────────────────────────────────
// Simple YAML parser/emitter (subset - enough for most config files)
function jsonToYaml(obj, indent = 0) {
  const pad = '  '.repeat(indent)
  if (obj === null) return 'null'
  if (typeof obj === 'boolean') return obj.toString()
  if (typeof obj === 'number') return obj.toString()
  if (typeof obj === 'string') {
    if (/[:#\[\]{},\n&*!|>'"%@`]/.test(obj) || obj === '') return JSON.stringify(obj)
    return obj
  }
  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]'
    return obj.map(item => `${pad}- ${jsonToYaml(item, indent + 1)}`).join('\n')
  }
  if (typeof obj === 'object') {
    const entries = Object.entries(obj)
    if (entries.length === 0) return '{}'
    return entries.map(([k, v]) => {
      const val = jsonToYaml(v, indent + 1)
      if (typeof v === 'object' && v !== null && !Array.isArray(v)) return `${pad}${k}:\n${val}`
      if (Array.isArray(v) && v.length > 0) return `${pad}${k}:\n${val}`
      return `${pad}${k}: ${val}`
    }).join('\n')
  }
  return String(obj)
}

function yamlToJson(yaml) {
  // Use a line-by-line approach for common YAML patterns
  const lines = yaml.split('\n')
  const root = {}
  const stack = [{ obj: root, indent: -1 }]
  
  for (let line of lines) {
    const trimmed = line.trimStart()
    if (!trimmed || trimmed.startsWith('#')) continue
    const indent = line.length - trimmed.length
    
    // Pop stack to find parent
    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) stack.pop()
    const parent = stack[stack.length - 1].obj
    
    if (trimmed.startsWith('- ')) {
      // Array item
      const val = parseYamlValue(trimmed.slice(2))
      if (!Array.isArray(parent.__arr)) parent.__arr = []
      parent.__arr.push(val)
    } else if (trimmed.includes(':')) {
      const colonIdx = trimmed.indexOf(':')
      const key = trimmed.slice(0, colonIdx).trim()
      const rawVal = trimmed.slice(colonIdx + 1).trim()
      if (rawVal === '' || rawVal === '|' || rawVal === '>') {
        const newObj = {}
        if (Array.isArray(parent)) parent.push(newObj)
        else parent[key] = newObj
        stack.push({ obj: newObj, indent })
      } else {
        if (Array.isArray(parent)) parent.push({ [key]: parseYamlValue(rawVal) })
        else parent[key] = parseYamlValue(rawVal)
      }
    }
  }
  
  return root
}

function parseYamlValue(v) {
  if (v === 'null' || v === '~') return null
  if (v === 'true') return true
  if (v === 'false') return false
  if (/^-?\d+$/.test(v)) return parseInt(v)
  if (/^-?\d+\.\d+$/.test(v)) return parseFloat(v)
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) return v.slice(1, -1)
  return v
}

export function YamlJsonTool({ showToast }) {
  const [input, setInput] = useState('')
  const [direction, setDirection] = useState('json2yaml') // json2yaml | yaml2json
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const convert = () => {
    setError('')
    try {
      if (direction === 'json2yaml') {
        const parsed = JSON.parse(input)
        setOutput(jsonToYaml(parsed))
      } else {
        const parsed = yamlToJson(input)
        setOutput(JSON.stringify(parsed, null, 2))
      }
    } catch (e) {
      setError(e.message)
      setOutput('')
    }
  }

  useEffect(() => { if (input.trim()) convert() }, [input, direction])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <ToolHeader title="YAML ↔ JSON Converter" desc="Convert between YAML and JSON formats">
        <Btn onClick={() => { navigator.clipboard.writeText(output); showToast('Copied') }}>Copy</Btn>
      </ToolHeader>

      <OptionsBar>
        <OptLabel>Direction:</OptLabel>
        <OptGroup>
          <OptBtn active={direction === 'json2yaml'} onClick={() => setDirection('json2yaml')}>JSON → YAML</OptBtn>
          <OptBtn active={direction === 'yaml2json'} onClick={() => setDirection('yaml2json')}>YAML → JSON</OptBtn>
        </OptGroup>
        <Btn style={{ marginLeft: 'auto' }} onClick={() => { setInput(output); setOutput(''); setDirection(direction === 'json2yaml' ? 'yaml2json' : 'json2yaml') }}>⇄ Swap</Btn>
      </OptionsBar>

      <Panels>
        <Panel0>
          <PanelLabel>{direction === 'json2yaml' ? 'JSON' : 'YAML'} Input</PanelLabel>
          <CodeArea value={input} onChange={setInput} placeholder={direction === 'json2yaml' ? '{\n  "name": "ConvertLab",\n  "version": 1,\n  "tools": ["json", "yaml"]\n}' : 'name: ConvertLab\nversion: 1\ntools:\n  - json\n  - yaml'} />
        </Panel0>
        <Panel>
          <PanelLabel right={error && <StatusBadge type="err">{error}</StatusBadge>}>
            {direction === 'json2yaml' ? 'YAML' : 'JSON'} Output
          </PanelLabel>
          <CodeArea value={output} readOnly placeholder="Output will appear here..." />
        </Panel>
      </Panels>
    </div>
  )
}

// ─── Text Statistics ──────────────────────────────────────────────
function analyzeText(text) {
  if (!text) return null
  const words = text.trim() ? text.trim().split(/\s+/) : []
  const sentences = text.split(/[.!?]+/).filter(s => s.trim())
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim())
  const chars = text.length
  const charsNoSpace = text.replace(/\s/g, '').length
  const lines = text.split('\n')
  const readingTime = Math.ceil(words.length / 238) // avg reading speed

  // Word frequency
  const freq = {}
  words.forEach(w => {
    const clean = w.toLowerCase().replace(/[^a-z]/g, '')
    if (clean.length > 2) freq[clean] = (freq[clean] || 0) + 1
  })
  const topWords = Object.entries(freq).sort(([, a], [, b]) => b - a).slice(0, 10)

  // Unique words
  const unique = new Set(words.map(w => w.toLowerCase().replace(/[^a-z]/g, '')).filter(Boolean)).size

  // Avg word length
  const avgWordLen = words.length ? (words.reduce((s, w) => s + w.replace(/[^a-z]/gi, '').length, 0) / words.length).toFixed(1) : 0

  return { chars, charsNoSpace, words: words.length, sentences: sentences.length, paragraphs: paragraphs.length, lines: lines.length, unique, avgWordLen, readingTime, topWords }
}

export function TextStatsTool({ showToast }) {
  const [input, setInput] = useState('')
  const stats = useMemo(() => analyzeText(input), [input])

  const StatCard = ({ label, value, sub, color }) => (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: '0.85rem 1rem' }}>
      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: '1.4rem', fontWeight: 500, color: color || 'var(--text)' }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>{sub}</div>}
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <ToolHeader title="Text Statistics" desc="Analyze text — word count, reading time, frequency and more" />

      <Panels>
        <Panel0 style={{ maxWidth: 360 }}>
          <PanelLabel>Input text</PanelLabel>
          <CodeArea value={input} onChange={setInput} placeholder="Paste or type text to analyze..." mono={false} />
        </Panel0>

        <Panel>
          <PanelLabel>Analysis</PanelLabel>
          <div style={{ flex: 1, overflow: 'auto', padding: '1rem' }}>
            {!stats ? (
              <div style={{ fontSize: 12, color: 'var(--text3)' }}>Type or paste text to see statistics</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 8 }}>
                  <StatCard label="Characters" value={stats.chars.toLocaleString()} sub={`${stats.charsNoSpace.toLocaleString()} no spaces`} />
                  <StatCard label="Words" value={stats.words.toLocaleString()} sub={`${stats.unique} unique`} color="var(--accent)" />
                  <StatCard label="Sentences" value={stats.sentences.toLocaleString()} />
                  <StatCard label="Paragraphs" value={stats.paragraphs.toLocaleString()} />
                  <StatCard label="Lines" value={stats.lines.toLocaleString()} />
                  <StatCard label="Avg word" value={stats.avgWordLen} sub="chars/word" />
                  <StatCard label="Reading time" value={`~${stats.readingTime}m`} sub="at 238 wpm" color="var(--accent3)" />
                </div>

                {stats.topWords.length > 0 && (
                  <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: '0.85rem 1rem' }}>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 10 }}>Top words</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      {stats.topWords.map(([word, count]) => (
                        <div key={word} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text)', minWidth: 80 }}>{word}</span>
                          <div style={{ flex: 1, height: 4, background: 'var(--bg4)', borderRadius: 99 }}>
                            <div style={{ width: `${(count / stats.topWords[0][1]) * 100}%`, height: '100%', background: 'var(--accent)', borderRadius: 99 }} />
                          </div>
                          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text3)', minWidth: 24, textAlign: 'right' }}>{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </Panel>
      </Panels>
    </div>
  )
}
