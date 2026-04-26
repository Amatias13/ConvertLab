import { useState, useEffect, useRef } from 'react'
import { ToolHeader, Panels, Panel0, Panel, PanelLabel, OptionsBar, OptLabel, OptGroup, OptBtn, Btn, CodeArea } from '../components/UI'

// ─── UUID Generator ───────────────────────────────────────────────
function genUUID4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = crypto.getRandomValues(new Uint8Array(1))[0] & 15
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}
function genNanoID() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'
  return Array.from(crypto.getRandomValues(new Uint8Array(21))).map(b => chars[b % 64]).join('')
}
function genToken(bytes) {
  return Array.from(crypto.getRandomValues(new Uint8Array(bytes / 2))).map(b => b.toString(16).padStart(2, '0')).join('')
}

export function UuidTool({ showToast }) {
  const [count, setCount] = useState(1)
  const [format, setFormat] = useState('uuid4')
  const [upper, setUpper] = useState(false)
  const [output, setOutput] = useState('')

  const generate = () => {
    const ids = Array.from({ length: count }, () => {
      if (format === 'uuid4') return genUUID4()
      if (format === 'nanoid') return genNanoID()
      if (format === 'token32') return genToken(32)
      return genToken(64)
    }).map(id => upper ? id.toUpperCase() : id.toLowerCase())
    setOutput(ids.join('\n'))
  }

  useEffect(() => { generate() }, [count, format, upper])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <ToolHeader title="UUID Generator" desc="Generate v4 UUIDs, NanoIDs, and random tokens">
        <Btn onClick={() => { navigator.clipboard.writeText(output); showToast('Copied') }}>Copy all</Btn>
        <Btn onClick={generate} primary>Regenerate</Btn>
      </ToolHeader>

      <OptionsBar>
        <OptLabel>Count:</OptLabel>
        <OptGroup>{[1, 5, 10, 25].map(n => <OptBtn key={n} active={count === n} onClick={() => setCount(n)}>{n}</OptBtn>)}</OptGroup>
        <OptLabel style={{ marginLeft: '0.75rem' }}>Format:</OptLabel>
        <OptGroup>
          {[['uuid4', 'UUID v4'], ['nanoid', 'NanoID'], ['token32', 'Token 32'], ['token64', 'Token 64']].map(([v, l]) => (
            <OptBtn key={v} active={format === v} onClick={() => setFormat(v)}>{l}</OptBtn>
          ))}
        </OptGroup>
        <OptLabel style={{ marginLeft: '0.75rem' }}>Case:</OptLabel>
        <OptGroup>
          <OptBtn active={!upper} onClick={() => setUpper(false)}>lower</OptBtn>
          <OptBtn active={upper} onClick={() => setUpper(true)}>UPPER</OptBtn>
        </OptGroup>
      </OptionsBar>

      <Panels>
        <Panel0>
          <PanelLabel right={`${count} generated`}>Output — click to copy individual</PanelLabel>
          <div style={{ flex: 1, overflow: 'auto', padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {output.split('\n').map((id, i) => (
              <div key={i} onClick={() => { navigator.clipboard.writeText(id); showToast('Copied') }}
                style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--text)', padding: '0.4rem 0.75rem', borderRadius: 6, background: 'var(--bg2)', border: '1px solid var(--border)', cursor: 'pointer', transition: 'border-color 0.12s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border3)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >{id}</div>
            ))}
          </div>
        </Panel0>
      </Panels>
    </div>
  )
}

// ─── Lorem Ipsum ──────────────────────────────────────────────────
const WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum'.split(' ')

const rw = () => WORDS[Math.floor(Math.random() * WORDS.length)]
const sentence = () => { const ws = Array.from({ length: 8 + Math.floor(Math.random() * 10) }, rw); return ws[0][0].toUpperCase() + ws.join(' ').slice(1) + '.' }
const paragraph = () => Array.from({ length: 3 + Math.floor(Math.random() * 4) }, sentence).join(' ')

export function LoremTool({ showToast }) {
  const [type, setType] = useState('paragraphs')
  const [count, setCount] = useState(3)
  const [classic, setClassic] = useState(false)
  const [output, setOutput] = useState('')

  const generate = () => {
    let result
    if (type === 'paragraphs') {
      const ps = Array.from({ length: count }, paragraph)
      if (classic) ps[0] = 'Lorem ipsum dolor sit amet. ' + paragraph()
      result = ps.join('\n\n')
    } else if (type === 'sentences') {
      const ss = Array.from({ length: count }, sentence)
      if (classic) ss[0] = 'Lorem ipsum dolor sit amet.'
      result = ss.join(' ')
    } else {
      const ws = Array.from({ length: count }, rw)
      if (classic) ws[0] = 'lorem'
      result = ws.join(' ')
    }
    setOutput(result)
  }

  useEffect(() => { generate() }, [type, count, classic])

  const wc = output.trim().split(/\s+/).filter(Boolean).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <ToolHeader title="Lorem Ipsum Generator" desc="Generate placeholder text in various formats">
        <Btn onClick={() => { navigator.clipboard.writeText(output); showToast('Copied') }}>Copy</Btn>
        <Btn onClick={generate} primary>Regenerate</Btn>
      </ToolHeader>

      <OptionsBar>
        <OptLabel>Type:</OptLabel>
        <OptGroup>
          {[['paragraphs', 'Paragraphs'], ['sentences', 'Sentences'], ['words', 'Words']].map(([v, l]) => (
            <OptBtn key={v} active={type === v} onClick={() => setType(v)}>{l}</OptBtn>
          ))}
        </OptGroup>
        <OptLabel style={{ marginLeft: '0.75rem' }}>Count:</OptLabel>
        <OptGroup>
          {[3, 5, 10, 20].map(n => <OptBtn key={n} active={count === n} onClick={() => setCount(n)}>{n}</OptBtn>)}
        </OptGroup>
        <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text2)', marginLeft: '0.75rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={classic} onChange={e => setClassic(e.target.checked)} style={{ accentColor: 'var(--accent)' }} />
          Start with "Lorem ipsum"
        </label>
      </OptionsBar>

      <Panels>
        <Panel0>
          <PanelLabel right={`${wc} words · ${output.length} chars`}>Output</PanelLabel>
          <CodeArea value={output} readOnly mono={false} />
        </Panel0>
      </Panels>
    </div>
  )
}

// ─── Cron Parser ──────────────────────────────────────────────────
const CRON_PRESETS = [
  { label: 'Every minute', value: '* * * * *' },
  { label: 'Every hour',   value: '0 * * * *' },
  { label: 'Daily 9am',    value: '0 9 * * *' },
  { label: 'Weekdays 9am', value: '0 9 * * 1-5' },
  { label: 'Every 15 min', value: '*/15 * * * *' },
  { label: 'Monthly 1st',  value: '0 0 1 * *' },
  { label: 'Midnight',     value: '0 0 * * *' },
]

function descField(f, names = []) {
  if (f === '*') return 'every'
  if (f.startsWith('*/')) return `every ${f.slice(2)}`
  if (f.includes('-')) { const [a, b] = f.split('-'); return `${names[a] || a}–${names[b] || b}` }
  if (f.includes(',')) return f.split(',').map(v => names[v] || v).join(', ')
  return names[f] || f
}

function getNextRuns(expr, count = 10) {
  const parts = expr.split(/\s+/)
  if (parts.length !== 5) return []
  const [min, hour, day, month, wd] = parts
  const results = []
  const d = new Date()
  d.setSeconds(0, 0)
  d.setMinutes(d.getMinutes() + 1)
  let tries = 0
  const matches = (field, val) => {
    if (field === '*') return true
    if (field.startsWith('*/')) return val % parseInt(field.slice(2)) === 0
    if (field.includes('-')) { const [a, b] = field.split('-').map(Number); return val >= a && val <= b }
    if (field.includes(',')) return field.split(',').map(Number).includes(val)
    return parseInt(field) === val
  }
  while (results.length < count && tries < 100000) {
    tries++
    if (matches(month, d.getMonth() + 1) && matches(day, d.getDate()) && matches(wd, d.getDay()) && matches(hour, d.getHours()) && matches(min, d.getMinutes())) {
      results.push(new Date(d))
    }
    d.setMinutes(d.getMinutes() + 1)
  }
  return results
}

export function CronTool() {
  const [expr, setExpr] = useState('0 9 * * 1-5')

  const parts = expr.trim().split(/\s+/)
  const valid = parts.length === 5
  const fieldDefs = [
    { name: 'Minute',      range: '0–59',  val: parts[0] },
    { name: 'Hour',        range: '0–23',  val: parts[1] },
    { name: 'Day/month',   range: '1–31',  val: parts[2] },
    { name: 'Month',       range: '1–12',  val: parts[3] },
    { name: 'Day/week',    range: '0–6',   val: parts[4] },
  ]
  const nextRuns = valid ? getNextRuns(expr) : []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <ToolHeader title="Cron Expression Parser" desc="Explain cron expressions and preview next run times" />
      <div style={{ flex: 1, overflow: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.1rem' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 8 }}>Expression</div>
          <input type="text" value={expr} onChange={e => setExpr(e.target.value)} style={{ fontFamily: 'var(--mono)', fontSize: '1.3rem', background: 'transparent', border: '1px solid var(--border2)', borderRadius: 8, padding: '0.5rem 0.85rem', color: 'var(--text)', outline: 'none', width: '100%' }} />
          <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
            {CRON_PRESETS.map(p => (
              <button key={p.value} onClick={() => setExpr(p.value)}
                style={{ padding: '0.22rem 0.65rem', borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text3)', fontSize: 11, cursor: 'pointer', fontFamily: 'var(--sans)' }}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {valid && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 8 }}>
            {fieldDefs.map(f => (
              <div key={f.name} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: '0.75rem' }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 4 }}>{f.name}<br/><span style={{ opacity: 0.6 }}>{f.range}</span></div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '1.1rem', color: 'var(--accent)' }}>{f.val}</div>
                <div style={{ fontSize: 10, color: 'var(--text2)', marginTop: 4 }}>{descField(f.val)}</div>
              </div>
            ))}
          </div>
        )}

        {nextRuns.length > 0 && (
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.1rem' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 10 }}>Next 10 runs</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 12, lineHeight: 2.2, color: 'var(--text2)' }}>
              {nextRuns.map((d, i) => (
                <div key={i}><span style={{ color: 'var(--text3)', marginRight: 10 }}>{String(i + 1).padStart(2, ' ')}.</span>{d.toLocaleString()}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Timestamp ────────────────────────────────────────────────────
function relativeTime(date) {
  const diff = (Date.now() - date.getTime()) / 1000
  const abs = Math.abs(diff), future = diff < 0
  const fmt = (n, u) => `${Math.round(n)} ${u}${future ? ' from now' : ' ago'}`
  if (abs < 60) return fmt(abs, 's')
  if (abs < 3600) return fmt(abs / 60, 'm')
  if (abs < 86400) return fmt(abs / 3600, 'h')
  return fmt(abs / 86400, 'd')
}

function tsRows(date) {
  if (isNaN(date.getTime())) return null
  return [
    ['UTC', date.toUTCString()],
    ['ISO 8601', date.toISOString()],
    ['Local', date.toLocaleString()],
    ['Date only', date.toLocaleDateString()],
    ['Time only', date.toLocaleTimeString()],
    ['Unix (s)', Math.floor(date.getTime() / 1000)],
    ['Unix (ms)', date.getTime()],
    ['Relative', relativeTime(date)],
  ]
}

export function TimestampTool({ showToast }) {
  const [unixVal, setUnixVal] = useState('')
  const [unit, setUnit] = useState('s')
  const [dateVal, setDateVal] = useState('')
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const unixDate = unixVal ? new Date(unit === 's' ? parseFloat(unixVal) * 1000 : parseFloat(unixVal)) : null
  const dateDate = dateVal ? new Date(dateVal) : null

  const ResultGrid = ({ date }) => {
    const rows = date ? tsRows(date) : null
    if (!rows) return null
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        {rows.map(([k, v]) => (
          <div key={k} onClick={() => { navigator.clipboard.writeText(String(v)); showToast('Copied') }}
            style={{ background: 'var(--bg3)', borderRadius: 8, padding: '0.45rem 0.7rem', cursor: 'pointer', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)' }}>{k}</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text)', marginTop: 2, wordBreak: 'break-all' }}>{String(v)}</div>
          </div>
        ))}
      </div>
    )
  }

  const Box = ({ title, children }) => (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.1rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)' }}>{title}</div>
      {children}
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <ToolHeader title="Timestamp Converter" desc="Convert between Unix timestamps and human-readable dates">
        <Btn primary onClick={() => {
          const ts = Date.now()
          setUnixVal(unit === 's' ? Math.floor(ts / 1000).toString() : ts.toString())
        }}>Now</Btn>
      </ToolHeader>

      <div style={{ flex: 1, overflow: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
        <Box title="Live clock">
          <div style={{ fontFamily: 'var(--mono)', fontSize: '1.25rem', color: 'var(--accent3)' }}>
            {Math.floor(now.getTime() / 1000)} <span style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>s</span>
            {'  '}
            {now.getTime()} <span style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>ms</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text2)', fontFamily: 'var(--mono)' }}>{now.toISOString()}</div>
        </Box>

        <Box title="Unix timestamp → Date">
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input type="text" value={unixVal} onChange={e => setUnixVal(e.target.value)} placeholder="1700000000" style={{ fontFamily: 'var(--mono)', fontSize: '1.1rem', flex: 1 }} />
            <OptGroup>
              <OptBtn active={unit === 's'} onClick={() => setUnit('s')}>Seconds</OptBtn>
              <OptBtn active={unit === 'ms'} onClick={() => setUnit('ms')}>Milliseconds</OptBtn>
            </OptGroup>
          </div>
          <ResultGrid date={unixDate} />
        </Box>

        <Box title="Date → Unix timestamp">
          <input type="datetime-local" value={dateVal} onChange={e => setDateVal(e.target.value)} />
          <ResultGrid date={dateDate} />
        </Box>
      </div>
    </div>
  )
}

// ─── QR Code ──────────────────────────────────────────────────────
export function QrTool({ showToast }) {
  const [text, setText] = useState('')
  const [ec, setEc] = useState('M')
  const [size, setSize] = useState(256)

  const qrUrl = text.trim()
    ? `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&ecc=${ec}&data=${encodeURIComponent(text)}&bgcolor=0f0f17&color=eeeef5&margin=3`
    : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <ToolHeader title="QR Code Generator" desc="Generate QR codes from any text or URL">
        {qrUrl && <a href={qrUrl} download="qrcode.png" target="_blank" rel="noreferrer"><Btn primary>Download PNG</Btn></a>}
      </ToolHeader>

      <OptionsBar>
        <OptLabel>Error correction:</OptLabel>
        <OptGroup>
          {['L', 'M', 'Q', 'H'].map(v => <OptBtn key={v} active={ec === v} onClick={() => setEc(v)}>{v}</OptBtn>)}
        </OptGroup>
        <OptLabel style={{ marginLeft: '0.75rem' }}>Size:</OptLabel>
        <OptGroup>
          {[[128, 'S'], [256, 'M'], [512, 'L']].map(([v, l]) => <OptBtn key={v} active={size === v} onClick={() => setSize(v)}>{l}</OptBtn>)}
        </OptGroup>
      </OptionsBar>

      <Panels>
        <Panel0 style={{ maxWidth: 340 }}>
          <PanelLabel>Content</PanelLabel>
          <CodeArea value={text} onChange={setText} placeholder={'Enter text, URL, email...\n\nhttps://github.com/your-repo'} mono={false} />
        </Panel0>
        <Panel>
          <PanelLabel>QR Code</PanelLabel>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            {qrUrl ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                <img src={qrUrl} alt="QR Code" style={{ borderRadius: 12, border: '1px solid var(--border)', maxWidth: size, imageRendering: 'pixelated' }} />
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>{text.length} chars · {size}×{size}px</div>
              </div>
            ) : (
              <div style={{ fontSize: 12, color: 'var(--text3)' }}>Type something to generate a QR code</div>
            )}
          </div>
        </Panel>
      </Panels>
    </div>
  )
}
