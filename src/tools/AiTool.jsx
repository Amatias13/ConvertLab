import { useState } from 'react'
import {
  ToolHeader, Panels, Panel0, Panel, PanelLabel,
  OptionsBar, OptLabel, OptBtn, Btn, CodeArea
} from '../components/UI'

const MODES = [
  { id: 'improve',   label: '✨ Improve',      system: 'Improve the grammar, style, and clarity. Keep the same meaning. Return ONLY the improved text, no explanations.' },
  { id: 'formal',    label: '🎩 Formal',        system: 'Rewrite in a formal, professional tone. Return ONLY the rewritten text.' },
  { id: 'casual',    label: '😊 Casual',        system: 'Rewrite in a friendly, casual tone. Return ONLY the rewritten text.' },
  { id: 'shorter',   label: '✂️ Shorter',       system: 'Make more concise. Remove redundancy, keep key info. Return ONLY the shortened text.' },
  { id: 'longer',    label: '📝 Expand',        system: 'Expand with detail and examples. Return ONLY the expanded text.' },
  { id: 'summarise', label: '📋 Summarise',     system: 'Write a 2-3 sentence summary. Return ONLY the summary.' },
  { id: 'bullets',   label: '• Bullets',        system: 'Convert to bullet points. Return ONLY the bullet list.' },
  { id: 'keywords',  label: '🏷 Keywords',      system: 'Extract 8-12 keywords. Return ONLY a comma-separated list.' },
  { id: 'translate', label: '🇵🇹 PT',           system: 'Translate to European Portuguese. Return ONLY the translation.' },
  { id: 'fix',       label: '🔧 Fix grammar',   system: 'Fix grammar and spelling only. Return ONLY the corrected text.' },
]

const MODELS = [
  { id: 'openai',        label: 'GPT-4o' },
  { id: 'claude',        label: 'Claude' },
  { id: 'gemini',        label: 'Gemini' },
  { id: 'mistral',       label: 'Mistral' },
  { id: 'deepseek',      label: 'DeepSeek' },
]

// Secret key injected at build time via VITE_ env var (GitHub Actions secret)
// In dev, falls back to anonymous mode
const SK = import.meta.env.VITE_POLLINATIONS_SK || ''

const isNotice = (text) =>
  text.includes('IMPORTANT NOTICE') ||
  text.includes('legacy text API') ||
  text.includes('enter.pollinations.ai') ||
  text.includes('being deprecated')

async function callWithSK(systemPrompt, userText, model) {
  // gen.pollinations.ai — requires sk_ key, injected at build time
  const res = await fetch('https://gen.pollinations.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SK}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userText },
      ],
      temperature: 0.7,
    }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `HTTP ${res.status}`)
  }
  const data = await res.json()
  const text = data?.choices?.[0]?.message?.content?.trim() || ''
  if (!text) throw new Error('empty_response')
  return text
}

async function callAnonymous(systemPrompt, userText, model) {
  // text.pollinations.ai — anonymous fallback (no auth header)
  const res = await fetch('https://text.pollinations.ai/openai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userText },
      ],
      temperature: 0.7,
      private: true,
      referrer: 'amatias13.github.io',
      seed: Math.floor(Math.random() * 99999),
    }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  const text = data?.choices?.[0]?.message?.content?.trim() || ''
  if (isNotice(text)) throw new Error('deprecation_notice')
  if (!text) throw new Error('empty_response')
  return text
}

async function callAnonymousGET(systemPrompt, userText, model) {
  // GET fallback — simplest form
  const params = new URLSearchParams({
    model, system: systemPrompt,
    temperature: '0.7', private: 'true',
    referrer: 'amatias13.github.io',
    seed: String(Math.floor(Math.random() * 99999)),
  })
  const url = `https://text.pollinations.ai/${encodeURIComponent(userText)}?${params}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const text = await res.text()
  if (isNotice(text)) throw new Error('deprecation_notice')
  if (!text.trim()) throw new Error('empty')
  return text.trim()
}

export default function AiTool({ showToast }) {
  const [input,   setInput]   = useState('')
  const [output,  setOutput]  = useState('')
  const [mode,    setMode]    = useState('improve')
  const [model,   setModel]   = useState('openai')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const hasSK = Boolean(SK)

  const run = async () => {
    if (!input.trim()) { showToast('Please enter some text first', 'warn'); return }
    const sel = MODES.find(m => m.id === mode)
    setLoading(true); setOutput(''); setError('')

    // Attempt chain: SK first (if available), then anonymous fallbacks
    const attempts = hasSK
      ? [
          () => callWithSK(sel.system, input, model),
          () => callAnonymous(sel.system, input, model),
          () => callAnonymousGET(sel.system, input, model),
        ]
      : [
          () => callAnonymous(sel.system, input, model),
          () => callAnonymousGET(sel.system, input, model),
          () => callAnonymousGET(sel.system, input, model === 'openai' ? 'mistral' : 'openai'),
        ]

    let result = null
    let lastErr = null

    for (const attempt of attempts) {
      try {
        result = await attempt()
        if (result) break
      } catch (e) {
        lastErr = e
      }
    }

    if (result) {
      setOutput(result)
    } else {
      setError(lastErr?.message || 'all_failed')
      showToast('AI unavailable — try again shortly', 'err')
    }
    setLoading(false)
  }

  const wc = t => t.trim().split(/\s+/).filter(Boolean).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <ToolHeader
        title="AI Text Enhancer"
        desc="Improve, rewrite, summarise and translate — free, no key needed"
      >
        {output && <Btn onClick={() => { navigator.clipboard.writeText(output); showToast('Copied') }}>Copy</Btn>}
        <Btn primary onClick={run} style={{ minWidth: 90 }}>{loading ? '⟳ Running…' : '▶ Run AI'}</Btn>
      </ToolHeader>

      <div style={{ padding: '0.4rem 1rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'rgba(63,232,160,0.04)' }}>
        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 100, background: 'rgba(63,232,160,0.15)', color: 'var(--accent3)', border: '1px solid rgba(63,232,160,0.25)', flexShrink: 0 }}>FREE</span>
        <span style={{ fontSize: 11.5, color: 'var(--text3)' }}>
          Powered by <a href="https://pollinations.ai" target="_blank" rel="noreferrer" style={{ color: 'var(--accent5)' }}>Pollinations.ai</a>
          {hasSK
            ? ' — running with API key (full access)'
            : ' — anonymous mode (no key, rate limited)'}
        </span>
      </div>

      <OptionsBar>
        <OptLabel>Model:</OptLabel>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {MODELS.map(m => <OptBtn key={m.id} active={model === m.id} onClick={() => setModel(m.id)}>{m.label}</OptBtn>)}
        </div>
      </OptionsBar>

      <OptionsBar>
        <OptLabel>Mode:</OptLabel>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {MODES.map(m => <OptBtn key={m.id} active={mode === m.id} onClick={() => setMode(m.id)}>{m.label}</OptBtn>)}
        </div>
      </OptionsBar>

      <Panels>
        <Panel0>
          <PanelLabel right={`${wc(input)} words`}>Your text</PanelLabel>
          <CodeArea value={input} onChange={setInput}
            placeholder={'Paste or type your text here…\n\nExample:\n"The quick brown fox jumps over the lazy dog."'}
            mono={false} />
        </Panel0>

        <Panel>
          <PanelLabel right={output ? `${wc(output)} words` : ''}>
            AI result
            {loading && <span style={{ marginLeft: 8, fontSize: 10, color: 'var(--accent)', animation: 'pulse 1s infinite' }}>● generating…</span>}
          </PanelLabel>

          {loading ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, padding: '1rem' }}>
              {[100, 80, 92, 65, 85, 55, 75].map((w, i) => (
                <div key={i} className="ai-shimmer" style={{ height: 13, borderRadius: 7, width: w + '%' }} />
              ))}
            </div>
          ) : error ? (
            <div style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ padding: '0.85rem', background: 'rgba(255,95,126,0.06)', border: '1px solid rgba(255,95,126,0.2)', borderRadius: 10, fontSize: 12.5, color: 'var(--accent2)', lineHeight: 1.6 }}>
                ⚠️ Pollinations.ai is temporarily unavailable.
              </div>
              <div style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.65 }}>
                Free public API — occasional downtime is expected. Try a different model or wait a moment.
              </div>
              <Btn onClick={run}>↺ Try again</Btn>
            </div>
          ) : output ? (
            <CodeArea value={output} onChange={setOutput} mono={false} />
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.85rem', padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem' }}>✨</div>
              <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7 }}>
                Select a <strong>model</strong> and <strong>mode</strong>,<br />
                enter your text and click <strong>Run AI</strong>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text3)', maxWidth: 300, lineHeight: 1.65 }}>
                100% free — no login, no cost.<br />
                Powered by Pollinations.ai open infrastructure.
              </div>
            </div>
          )}
        </Panel>
      </Panels>
    </div>
  )
}
