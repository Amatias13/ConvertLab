import { useState, useEffect } from 'react'
import {
  ToolHeader, OptionsBar, OptLabel, OptGroup, OptBtn
} from '../components/UI'

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
    toBase: null,
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

export default function UnitConverterTool({ showToast }) {
  const [category, setCategory] = useState('Length')
  const [from, setFrom] = useState('m')
  const [value, setValue] = useState('')

  const cat = UNIT_CATEGORIES[category]

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
