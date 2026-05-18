import { useState, useCallback } from 'react'
import { ToolHeader, Panels, Panel0, Panel, PanelLabel, OptionsBar, OptLabel, OptGroup, OptBtn, Btn, CodeArea, StatusBadge } from '../components/UI'

export default function JsonTool({ showToast }) {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [indent, setIndent] = useState(2)
  const [status, setStatus] = useState(null) // null | 'ok' | 'err'
  const [error, setError] = useState('')

  const validate = useCallback((val) => {
    if (!val.trim()) { setStatus(null); setError(''); return }
    try { JSON.parse(val); setStatus('ok'); setError('') }
    catch (e) { setStatus('err'); setError(e.message) }
  }, [])

  const handleInput = (val) => {
    setInput(val)
    validate(val)
  }

  const format = () => {
    try {
      const ind = indent === 'tab' ? '\t' : indent
      setOutput(JSON.stringify(JSON.parse(input), null, ind))
      setError('')
    } catch (e) { setError(e.message) }
  }

  const minify = () => {
    try { setOutput(JSON.stringify(JSON.parse(input))); setError('') }
    catch (e) { setError(e.message) }
  }

  const copy = () => {
    navigator.clipboard.writeText(output)
    showToast('Copied to clipboard')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <ToolHeader title="JSON Formatter & Validator" desc="Format, minify and validate JSON">
        <Btn onClick={minify}>Minify</Btn>
        <Btn onClick={format} primary>Format</Btn>
      </ToolHeader>

      <OptionsBar>
        <OptLabel>Indent:</OptLabel>
        <OptGroup>
          {[2, 4, 'tab'].map(v => (
            <OptBtn key={v} active={indent === v} onClick={() => setIndent(v)}>{v}</OptBtn>
          ))}
        </OptGroup>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          <Btn onClick={copy}>Copy</Btn>
          <Btn onClick={() => { setInput(''); setOutput(''); setStatus(null); setError('') }}>Clear</Btn>
        </div>
      </OptionsBar>

      <Panels>
        <Panel0>
          <PanelLabel right={status && (
            <StatusBadge type={status}>{status === 'ok' ? 'Valid JSON' : 'Invalid JSON'}</StatusBadge>
          )}>Input</PanelLabel>
          <CodeArea value={input} onChange={handleInput} placeholder={'Paste your JSON here...\n\n{"name":"ConvertLab","awesome":true}'} />
        </Panel0>

        <Panel>
          <PanelLabel>Output</PanelLabel>
          <CodeArea value={output} readOnly placeholder="Formatted output will appear here..." />
        </Panel>
      </Panels>

      {error && (
        <div style={{
          padding: '0.45rem 1rem',
          background: '#ff5f7e0d',
          borderTop: '1px solid #ff5f7e22',
          fontFamily: 'var(--mono)',
          fontSize: 11,
          color: 'var(--accent2)',
        }}>
          {error}
        </div>
      )}
    </div>
  )
}
