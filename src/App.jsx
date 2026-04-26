import { useState, useMemo } from 'react'
import { TOOLS, ALL_TOOLS } from './tools/registry'
import { Toast, useToast } from './components/UI'
import JsonTool from './tools/JsonTool'
import Base64Tool from './tools/Base64Tool'
import UrlTool from './tools/UrlTool'
import HashTool from './tools/HashTool'
import JwtTool from './tools/JwtTool'
import BaseTool from './tools/BaseTool'
import CsvTool from './tools/CsvTool'
import MarkdownTool from './tools/MarkdownTool'
import HtmlTool from './tools/HtmlTool'
import { EmailTool, RegexTool, DiffTool, CaseTool } from './tools/TextTools'
import { UuidTool, LoremTool, CronTool, TimestampTool, QrTool } from './tools/GeneratorTools'
import { ImageTool, ColorTool } from './tools/MediaTools'
import { SqlTool, PasswordTool, UnitConverterTool, HtmlEntitiesTool, NumberFormatterTool, YamlJsonTool, TextStatsTool } from './tools/MoreTools'

const TOOL_MAP = {
  json: JsonTool, base64: Base64Tool, url: UrlTool, hash: HashTool,
  jwt: JwtTool, base: BaseTool, csv: CsvTool, markdown: MarkdownTool,
  html: HtmlTool, email: EmailTool, regex: RegexTool, diff: DiffTool,
  caseconv: CaseTool, uuid: UuidTool, lorem: LoremTool, cron: CronTool,
  timestamp: TimestampTool, qr: QrTool, image: ImageTool, color: ColorTool,
  sql: SqlTool, password: PasswordTool, units: UnitConverterTool,
  entities: HtmlEntitiesTool, numfmt: NumberFormatterTool,
  yaml: YamlJsonTool, textstats: TextStatsTool,
}

export default function App() {
  const [activeTool, setActiveTool] = useState('json')
  const [search, setSearch] = useState('')
  const { toast, show: showToast } = useToast()

  const filtered = useMemo(() => {
    if (!search.trim()) return TOOLS
    const q = search.toLowerCase()
    return TOOLS
      .map(group => ({ ...group, items: group.items.filter(t => t.label.toLowerCase().includes(q) || t.id.includes(q)) }))
      .filter(g => g.items.length > 0)
  }, [search])

  const ActiveTool = TOOL_MAP[activeTool]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Header */}
      <header style={{
        display: 'flex', alignItems: 'center', padding: '0 1.5rem', height: 52,
        borderBottom: '1px solid var(--border)', background: 'rgba(9,9,14,0.92)',
        backdropFilter: 'blur(12px)', flexShrink: 0, zIndex: 10, gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', cursor: 'pointer' }} onClick={() => setActiveTool('json')}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 12px var(--accent)', display: 'inline-block', animation: 'pulse 2s ease-in-out infinite', flexShrink: 0 }} />
          <span style={{ fontFamily: 'var(--display)', fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em' }}>ConvertLab</span>
          <span style={{ fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 300, color: 'var(--text3)', letterSpacing: '0.04em' }}>one tool for every transformation</span>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: 'var(--text3)', padding: '0.25rem 0.65rem', border: '1px solid var(--border)', borderRadius: 100 }}>{ALL_TOOLS.length} tools</span>
          <a href="https://github.com" target="_blank" rel="noreferrer"
            style={{ padding: '0.25rem 0.65rem', border: '1px solid var(--border)', borderRadius: 100, color: 'var(--text3)', fontSize: 11, textDecoration: 'none', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--border2)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text3)'; e.currentTarget.style.borderColor = 'var(--border)' }}
          >GitHub ↗</a>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <nav style={{ width: 214, flexShrink: 0, borderRight: '1px solid var(--border)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {/* Search */}
          <div style={{ padding: '0.6rem 0.75rem', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.32rem 0.65rem' }}>
              <span style={{ color: 'var(--text3)', fontSize: 12, lineHeight: 1, flexShrink: 0 }}>⌕</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tools..."
                style={{ background: 'none', border: 'none', outline: 'none', fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--text)', width: '100%', padding: 0 }} />
              {search && (
                <span onClick={() => setSearch('')} style={{ cursor: 'pointer', color: 'var(--text3)', fontSize: 12, lineHeight: 1, flexShrink: 0 }}>✕</span>
              )}
            </div>
          </div>

          {/* Tool list */}
          <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '0.75rem' }}>
            {filtered.length === 0 && (
              <div style={{ padding: '1.25rem 1rem', fontSize: 12, color: 'var(--text3)' }}>No tools match "{search}"</div>
            )}
            {filtered.map(group => (
              <div key={group.section}>
                <div style={{ padding: '0.75rem 1rem 0.3rem', fontSize: 9.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text3)' }}>
                  {group.section}
                </div>
                {group.items.map(tool => {
                  const active = activeTool === tool.id
                  return (
                    <button key={tool.id} onClick={() => setActiveTool(tool.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.55rem',
                        padding: '0.48rem 1rem', width: '100%', textAlign: 'left',
                        background: active ? 'var(--bg3)' : 'transparent',
                        border: 'none', borderLeft: `2px solid ${active ? 'var(--accent)' : 'transparent'}`,
                        color: active ? 'var(--text)' : 'var(--text2)',
                        fontSize: 13, cursor: 'pointer', fontFamily: 'var(--sans)', transition: 'all 0.1s',
                      }}
                      onMouseEnter={e => { if (!active) { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.background = 'var(--bg2)' } }}
                      onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'var(--text2)'; e.currentTarget.style.background = 'transparent' } }}
                    >
                      <span style={{
                        width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 10, fontWeight: 600,
                        background: tool.color + '1a', color: tool.color,
                      }}>
                        {tool.icon}
                      </span>
                      {tool.label}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        </nav>

        {/* Main content */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}
          className="fade-in" key={activeTool}>
          {ActiveTool ? <ActiveTool showToast={showToast} /> : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text3)' }}>
              Tool not found
            </div>
          )}
        </main>
      </div>

      <Toast message={toast} />
    </div>
  )
}
