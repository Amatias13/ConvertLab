import { useState, useMemo } from 'react'
import {
  ToolHeader, Panels, Panel0, Panel, PanelLabel,
  OptionsBar, OptLabel, OptGroup, OptBtn, Btn, CodeArea
} from '../components/UI'

const ENTITY_MAP = {
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  '©': '&copy;', '®': '&reg;', '™': '&trade;', '€': '&euro;',
  '£': '&pound;', '¥': '&yen;', '¢': '&cent;', '°': '&deg;',
  '±': '&plusmn;', '×': '&times;', '÷': '&divide;', '→': '&rarr;',
  '←': '&larr;', '↑': '&uarr;', '↓': '&darr;', '↔': '&harr;',
  '…': '&hellip;', '—': '&mdash;', '–': '&ndash;', ' ': '&nbsp;',
  '«': '&laquo;', '»': '&raquo;', '•': '&bull;', '‣': '&#8227;',
}

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

export default function HtmlEntitiesTool({ showToast }) {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState('essential')

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
