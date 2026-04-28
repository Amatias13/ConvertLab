import { useState, useRef, useCallback } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import { AboutModal } from './components/AboutModal'
import { FeedbackModal, CoffeeModal, ToastStack } from './components/Modals'
import { ProfileModal } from './components/ProfileModal'
import { useKeyboardShortcuts, ShortcutsModal } from './components/Shortcuts'

import JsonTool     from './tools/JsonTool'
import Base64Tool   from './tools/Base64Tool'
import UrlTool      from './tools/UrlTool'
import HashTool     from './tools/HashTool'
import JwtTool      from './tools/JwtTool'
import BaseTool     from './tools/BaseTool'
import CsvTool      from './tools/CsvTool'
import MarkdownTool from './tools/MarkdownTool'
import HtmlTool     from './tools/HtmlTool'
import AiTool       from './tools/AiTool'
import { EmailTool, RegexTool, DiffTool, CaseTool } from './tools/TextTools'
import { UuidTool, LoremTool, CronTool, TimestampTool, QrTool } from './tools/GeneratorTools'
import { ImageTool, ColorTool } from './tools/MediaTools'
import { SqlTool, PasswordTool, UnitConverterTool, HtmlEntitiesTool, NumberFormatterTool, YamlJsonTool, TextStatsTool } from './tools/MoreTools'

const TOOL_MAP = {
  ai: AiTool, json: JsonTool, base64: Base64Tool, url: UrlTool,
  hash: HashTool, jwt: JwtTool, base: BaseTool, csv: CsvTool,
  markdown: MarkdownTool, html: HtmlTool, email: EmailTool,
  regex: RegexTool, diff: DiffTool, caseconv: CaseTool,
  entities: HtmlEntitiesTool, textstats: TextStatsTool,
  uuid: UuidTool, lorem: LoremTool, password: PasswordTool,
  cron: CronTool, timestamp: TimestampTool, units: UnitConverterTool,
  numfmt: NumberFormatterTool, image: ImageTool, color: ColorTool,
  qr: QrTool, sql: SqlTool, yaml: YamlJsonTool,
}

function AppInner() {
  const [activeTool, setActiveToolState] = useState('json')
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const searchInputRef = useRef(null)
  const { showToast, recordUsage } = useApp()

  const setActiveTool = useCallback((id) => {
    setActiveToolState(id)
    recordUsage(id)
  }, [recordUsage])

  // open search from keyboard shortcut
  const openSearch = useCallback((val) => {
    setSearchOpen(val)
    if (val) setTimeout(() => searchInputRef.current?.focus(), 50)
  }, [])

  useKeyboardShortcuts({
    setActiveTool,
    activeTool,
    setSearchOpen: openSearch,
    setShortcutsOpen,
  })

  const ActiveTool = TOOL_MAP[activeTool]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Header
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        searchOpen={searchOpen}
        setSearchOpen={openSearch}
        searchInputRef={searchInputRef}
      />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar activeTool={activeTool} setActiveTool={setActiveTool} />
        <main
          key={activeTool}
          className="fade-in"
          style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}
        >
          {ActiveTool
            ? <ActiveTool showToast={showToast} />
            : <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text3)', fontSize: 14 }}>
                Select a tool from the sidebar
              </div>
          }
        </main>
      </div>

      <AboutModal toolId={activeTool} />
      <FeedbackModal />
      <CoffeeModal />
      <ProfileModal />
      <ShortcutsModal open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
      <ToastStack />
    </div>
  )
}

export default function App() {
  return <AppProvider><AppInner /></AppProvider>
}
