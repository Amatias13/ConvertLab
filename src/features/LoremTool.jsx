import { useState, useEffect } from 'react'
import { ToolHeader, Panels, Panel0, PanelLabel, OptionsBar, OptLabel, OptGroup, OptBtn, Btn, CodeArea } from '../components/UI'

const WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum'.split(' ')

const rw = () => WORDS[Math.floor(Math.random() * WORDS.length)]
const sentence = () => { const ws = Array.from({ length: 8 + Math.floor(Math.random() * 10) }, rw); return ws[0][0].toUpperCase() + ws.join(' ').slice(1) + '.' }
const paragraph = () => Array.from({ length: 3 + Math.floor(Math.random() * 4) }, sentence).join(' ')

export default function LoremTool({ showToast }) {
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
