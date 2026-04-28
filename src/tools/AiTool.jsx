import { useState } from 'react'
import { ToolHeader, Panels, Panel0, Panel, PanelLabel, OptionsBar, OptLabel, OptBtn, Btn, CodeArea } from '../components/UI'

const MODES = [
  { id: 'improve', label: '✨ Improve', system: 'You are a writing assistant. Improve the grammar, style, and clarity of the text the user provides. Keep the same meaning and tone. Return only the improved text, no explanations, no preamble.' },
  { id: 'formal', label: '🎩 Formal', system: 'You are a writing assistant. Rewrite the text the user provides in a formal, professional tone suitable for business communication. Return only the rewritten text.' },
  { id: 'casual', label: '😊 Casual', system: 'You are a writing assistant. Rewrite the text the user provides in a friendly, casual conversational tone. Return only the rewritten text.' },
  { id: 'shorter', label: '✂️ Shorter', system: 'You are a writing assistant. Make the text the user provides more concise. Remove redundancy, keep all key information. Return only the shortened text.' },
  { id: 'longer', label: '📝 Expand', system: 'You are a writing assistant. Expand the text the user provides with more detail, examples, and explanation while staying on topic. Return only the expanded text.' },
  { id: 'summarise', label: '📋 Summarise', system: 'You are a writing assistant. Write a clear concise summary of the text the user provides in 2-3 sentences. Return only the summary.' },
  { id: 'bullets', label: '• Bullets', system: 'You are a writing assistant. Convert the text the user provides into clear bullet points. Return only the bullet list.' },
  { id: 'keywords', label: '🏷 Keywords', system: 'You are a writing assistant. Extract the 8-12 most important keywords from the text the user provides. Return them comma-separated, most important first.' },
  { id: 'translate', label: '🇵🇹 Translate PT', system: 'You are a translator. Translate the text the user provides to European Portuguese (Portugal). Return only the translation.' },
  { id: 'fix', label: '🔧 Fix grammar', system: 'You are a proofreader. Fix only the grammar and spelling mistakes in the text the user provides. Do not change the wording otherwise. Return only the corrected text.' },
]

// Filter out Pollinations deprecation notices from the response
function cleanPollinationsResponse(text) {
  // Remove known deprecation notice patterns
  const deprecationPatterns = [
    /\*{0,2}IMPORTANT NOTICE\*{0,2}[\s\S]*?continue to work normally\./gi,
    /The Pollinations legacy text API[\s\S]*?continue to work normally\./gi,
    /Please migrate to our new service[\s\S]*?latest models\./gi,
    /Note: Anonymous requests[\s\S]*?work normally\./gi,
  ]
  let cleaned = text
  for (const pattern of deprecationPatterns) {
    cleaned = cleaned.replace(pattern, '')
  }
  return cleaned.trim()
}

async function callPollinations(systemPrompt, userText) {
  // New Pollinations API endpoint
  const res = await fetch('https://text.pollinations.ai/openai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'openai',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userText },
      ],
      seed: Math.floor(Math.random() * 10000),
      private: true,
    }),
  })

  if (!res.ok) throw new Error(`Pollinations error ${res.status}`)

  const data = await res.json()
  // New API returns OpenAI-compatible format
  const text = data?.choices?.[0]?.message?.content || data?.text || ''
  return cleanPollinationsResponse(text)
}

async function callPollinationsLegacy(systemPrompt, userText) {
  // Legacy endpoint as fallback — anonymous requests still work
  const fullPrompt = `${systemPrompt}\n\n---\n\n${userText}`
  const encoded = encodeURIComponent(fullPrompt)
  const res = await fetch(`https://text.pollinations.ai/${encoded}`, {
    method: 'GET',
    headers: { 'Accept': 'text/plain' },
  })
  if (!res.ok) throw new Error(`Pollinations error ${res.status}`)
  const text = await res.text()
  return cleanPollinationsResponse(text)
}

export default function AiTool({ showToast }) {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState('improve')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const run = async () => {
    if (!input.trim()) { showToast('Please enter some text first', 'warn'); return }
    const selectedMode = MODES.find(m => m.id === mode)
    setLoading(true); setOutput(''); setError('')

    try {
      // Try new OpenAI-compatible endpoint first
      let result
      try {
        result = await callPollinations(selectedMode.system, input)
      } catch {
        // Fallback to legacy endpoint
        result = await callPollinationsLegacy(selectedMode.system, input)
      }

      if (!result) throw new Error('Empty response from AI')
      setOutput(result)
    } catch (e) {
      setError(e.message)
      showToast('AI error: ' + e.message, 'err')
    } finally {
      setLoading(false)
    }
  }

  const wc = t => t.trim().split(/\s+/).filter(Boolean).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <ToolHeader title="AI Text Enhancer" desc="Improve, rewrite, summarise and translate — powered by Pollinations.ai (free, no key needed)">
        {output && <Btn onClick={() => { navigator.clipboard.writeText(output); showToast('Copied') }}>Copy</Btn>}
        <Btn primary onClick={run} style={{ minWidth: 90 }}>{loading ? '⟳ Running…' : '▶ Run AI'}</Btn>
      </ToolHeader>

      {/* Free badge */}
      <div style={{ padding: '0.4rem 1rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'rgba(63,232,160,0.04)' }}>
        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 100, background: 'rgba(63,232,160,0.15)', color: 'var(--accent3)', border: '1px solid rgba(63,232,160,0.25)', flexShrink: 0 }}>FREE</span>
        <span style={{ fontSize: 11.5, color: 'var(--text3)' }}>
          Powered by <a href="https://pollinations.ai" target="_blank" rel="noreferrer" style={{ color: 'var(--accent5)' }}>Pollinations.ai</a> — no API key, no account, no cost.
        </span>
      </div>

      {/* Mode selector */}
      <OptionsBar>
        <OptLabel>Mode:</OptLabel>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {MODES.map(m => <OptBtn key={m.id} active={mode === m.id} onClick={() => setMode(m.id)}>{m.label}</OptBtn>)}
        </div>
      </OptionsBar>

      <Panels>
        <Panel0>
          <PanelLabel right={`${wc(input)} words`}>Your text</PanelLabel>
          <CodeArea
            value={input}
            onChange={setInput}
            placeholder={'Paste or type your text here…\n\nExample: "The quick brown fox jumps over the lazy dog."'}
            mono={false}
          />
        </Panel0>

        <Panel>
          <PanelLabel right={output ? `${wc(output)} words` : ''}>
            AI result
            {loading && (
              <span style={{ marginLeft: 8, fontSize: 10, color: 'var(--accent)', animation: 'pulse 1s infinite' }}>
                ● generating…
              </span>
            )}
          </PanelLabel>

          {loading ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, padding: '1rem' }}>
              {[100, 85, 92, 70, 88, 60, 75].map((w, i) => (
                <div key={i} className="ai-shimmer" style={{ height: 13, borderRadius: 7, width: w + '%' }} />
              ))}
            </div>
          ) : error ? (
            <div style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ padding: '0.85rem', background: 'rgba(255,95,126,0.06)', border: '1px solid rgba(255,95,126,0.2)', borderRadius: 10, fontSize: 12.5, color: 'var(--accent2)', lineHeight: 1.6 }}>
                ⚠️ {error}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.6 }}>
                Pollinations.ai may be temporarily unavailable. Try again in a moment.
              </div>
            </div>
          ) : output ? (
            <CodeArea value={output} onChange={setOutput} mono={false} />
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '2rem', color: 'var(--text3)', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem' }}>✨</div>
              <div style={{ fontSize: 13, color: 'var(--text2)' }}>
                Select a mode, enter your text, and click <strong>Run AI</strong>
              </div>
              <div style={{ fontSize: 11, maxWidth: 280, lineHeight: 1.6 }}>
                100% free — powered by Pollinations.ai open AI infrastructure.
              </div>
            </div>
          )}
        </Panel>
      </Panels>
    </div>
  )
}
