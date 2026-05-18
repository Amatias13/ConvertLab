import { useState } from 'react'
import { ToolHeader, Panels, Panel0, Panel, PanelLabel, OptionsBar, OptLabel, OptGroup, OptBtn, Btn, CodeArea } from '../components/UI'

export default function Base64Tool({ showToast }) {
  const [plain, setPlain] = useState('')
  const [encoded, setEncoded] = useState('')
  const [urlSafe, setUrlSafe] = useState(false)

  const encode = () => {
    try {
      let enc = btoa(unescape(encodeURIComponent(plain)))
      if (urlSafe) enc = enc.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
      setEncoded(enc)
    } catch (e) { showToast('Encoding error: ' + e.message) }
  }

  const decode = () => {
    try {
      let v = encoded
      if (urlSafe) v = v.replace(/-/g, '+').replace(/_/g, '/')
      setPlain(decodeURIComponent(escape(atob(v))))
    } catch { showToast('Invalid Base64 input') }
  }

  const inSize = plain.length
  const outSize = encoded.length
  const ratio = inSize ? ((outSize / inSize) * 100).toFixed(0) + '%' : '—'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <ToolHeader title="Base64 Encoder / Decoder" desc="Encode text to Base64 and back">
        <Btn onClick={encode} primary>Encode →</Btn>
        <Btn onClick={decode}>← Decode</Btn>
      </ToolHeader>

      <OptionsBar>
        <OptLabel>Mode:</OptLabel>
        <OptGroup>
          <OptBtn active={!urlSafe} onClick={() => setUrlSafe(false)}>Standard</OptBtn>
          <OptBtn active={urlSafe} onClick={() => setUrlSafe(true)}>URL-safe</OptBtn>
        </OptGroup>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, fontSize: 11, color: 'var(--text3)', alignItems: 'center' }}>
          <span>In: <b style={{ color: 'var(--text2)', fontFamily: 'var(--mono)' }}>{inSize}b</b></span>
          <span>Out: <b style={{ color: 'var(--text2)', fontFamily: 'var(--mono)' }}>{outSize}b</b></span>
          <span>Ratio: <b style={{ color: 'var(--text2)', fontFamily: 'var(--mono)' }}>{ratio}</b></span>
          <Btn onClick={() => { navigator.clipboard.writeText(encoded); showToast('Copied') }}>Copy</Btn>
        </div>
      </OptionsBar>

      <Panels>
        <Panel0>
          <PanelLabel>Plain text</PanelLabel>
          <CodeArea value={plain} onChange={setPlain} placeholder="Enter text to encode..." mono={false} />
        </Panel0>
        <Panel>
          <PanelLabel>Base64</PanelLabel>
          <CodeArea value={encoded} onChange={setEncoded} placeholder="Base64 output..." />
        </Panel>
      </Panels>
    </div>
  )
}
