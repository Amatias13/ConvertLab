import { useState } from 'react'
import {
  ToolHeader, OptLabel, OptGroup, OptBtn
} from '../components/UI'

const LOCALES = [
  { label: 'PT (1.234,56)',  locale: 'pt-PT' },
  { label: 'EN (1,234.56)', locale: 'en-US' },
  { label: 'DE (1.234,56)', locale: 'de-DE' },
  { label: 'FR (1 234,56)', locale: 'fr-FR' },
  { label: 'IN (1,23,456)', locale: 'en-IN' },
  { label: "CH (1'234.56)", locale: 'de-CH' },
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

function toRoman(num) {
  const vals = [1000,900,500,400,100,90,50,40,10,9,5,4,1]
  const syms = ['M','CM','D','CD','C','XC','L','XL','X','IX','V','IV','I']
  let res = ''
  vals.forEach((v, i) => { while (num >= v) { res += syms[i]; num -= v } })
  return res
}

export default function NumberFormatterTool({ showToast }) {
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
