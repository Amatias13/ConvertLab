import { useState } from 'react'
import { ToolHeader, Panels, Panel0, Panel, PanelLabel, OptionsBar, OptLabel, OptGroup, OptBtn, Btn, CodeArea } from '../components/UI'

export default function QrTool() {
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
