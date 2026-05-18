import { useState, useEffect } from 'react'
import { ToolHeader, OptGroup, OptBtn, Btn } from '../components/UI'

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

export default function TimestampTool({ showToast }) {
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
