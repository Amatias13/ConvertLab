import { useState } from 'react'
import { ToolHeader, Panels, Panel0, Panel, PanelLabel, Btn, CodeArea, StatusBadge } from '../components/UI'

function b64Decode(str) {
  return atob(str.replace(/-/g, '+').replace(/_/g, '/'))
}

const partColors = {
  header:  { bg: '#ff5f7e0a', label: '#ff5f7e', name: 'Header' },
  payload: { bg: '#7c6dff0a', label: '#7c6dff', name: 'Payload' },
  sig:     { bg: '#3fe8a00a', label: '#3fe8a0', name: 'Signature' },
}

export default function JwtTool({ showToast }) {
  const [input, setInput] = useState('')

  let decoded = null
  let status = null
  let statusType = null

  if (input.trim()) {
    const parts = input.trim().split('.')
    if (parts.length !== 3) {
      status = 'Invalid JWT (needs 3 parts)'
      statusType = 'err'
    } else {
      try {
        const header = JSON.parse(b64Decode(parts[0]))
        const payload = JSON.parse(b64Decode(parts[1]))
        let expInfo = null
        if (payload.exp) {
          const exp = new Date(payload.exp * 1000)
          const expired = exp < new Date()
          expInfo = { date: exp.toLocaleString(), expired }
        }
        decoded = { header, payload, sig: parts[2], expInfo }
        status = 'Valid structure'
        statusType = 'ok'
      } catch (e) {
        status = 'Decode error: ' + e.message
        statusType = 'err'
      }
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <ToolHeader title="JWT Decoder" desc="Decode and inspect JSON Web Tokens">
        <Btn onClick={() => setInput('')}>Clear</Btn>
      </ToolHeader>

      <Panels>
        <Panel0 style={{ maxWidth: 340 }}>
          <PanelLabel right={status && <StatusBadge type={statusType}>{status}</StatusBadge>}>
            JWT Token
          </PanelLabel>
          <CodeArea
            value={input}
            onChange={setInput}
            placeholder={'Paste JWT token...\n\neyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'}
          />
        </Panel0>

        <Panel>
          <PanelLabel>Decoded</PanelLabel>
          <div style={{ flex: 1, overflow: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {!decoded && (
              <div style={{ fontSize: 12, color: 'var(--text3)' }}>Paste a JWT token to decode it</div>
            )}
            {decoded && (
              <>
                {[
                  { key: 'header', data: decoded.header },
                  { key: 'payload', data: decoded.payload },
                ].map(({ key, data }) => {
                  const c = partColors[key]
                  return (
                    <div key={key} style={{ borderRadius: 10, border: '1px solid var(--border)', overflow: 'hidden' }}>
                      <div style={{ padding: '0.5rem 0.85rem', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: c.label, background: c.bg, borderBottom: '1px solid var(--border)' }}>
                        {c.name}
                        {key === 'payload' && decoded.expInfo && (
                          <span style={{ marginLeft: 12, fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: decoded.expInfo.expired ? 'var(--accent2)' : 'var(--accent3)' }}>
                            Expires {decoded.expInfo.date} — {decoded.expInfo.expired ? '⚠ EXPIRED' : '✓ Valid'}
                          </span>
                        )}
                      </div>
                      <pre style={{ padding: '0.85rem', fontFamily: 'var(--mono)', fontSize: 12, lineHeight: 1.7, background: 'var(--bg2)', overflowX: 'auto' }}>
                        {JSON.stringify(data, null, 2)}
                      </pre>
                    </div>
                  )
                })}
                <div style={{ borderRadius: 10, border: '1px solid var(--border)', overflow: 'hidden' }}>
                  <div style={{ padding: '0.5rem 0.85rem', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: partColors.sig.label, background: partColors.sig.bg, borderBottom: '1px solid var(--border)' }}>
                    Signature <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: 'var(--text3)' }}>(not verified)</span>
                  </div>
                  <pre style={{ padding: '0.85rem', fontFamily: 'var(--mono)', fontSize: 12, lineHeight: 1.7, background: 'var(--bg2)', wordBreak: 'break-all', whiteSpace: 'pre-wrap', color: 'var(--text3)' }}>
                    {decoded.sig}
                  </pre>
                </div>
              </>
            )}
          </div>
        </Panel>
      </Panels>
    </div>
  )
}
