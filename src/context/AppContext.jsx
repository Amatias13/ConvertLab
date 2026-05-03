import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AppContext = createContext(null)

async function hashString(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export const ACCENT_PALETTES = [
  { name: 'Purple',  accent: '#7c6dff', accent2: '#ff5f7e', accent3: '#3fe8a0', accent4: '#ffba3b', accent5: '#38b6ff' },
  { name: 'Cyan',    accent: '#00cec9', accent2: '#fd79a8', accent3: '#55efc4', accent4: '#ffeaa7', accent5: '#74b9ff' },
  { name: 'Orange',  accent: '#fd9a00', accent2: '#e17055', accent3: '#00b894', accent4: '#ffeaa7', accent5: '#74b9ff' },
  { name: 'Rose',    accent: '#e84393', accent2: '#a855f7', accent3: '#3fe8a0', accent4: '#fbbf24', accent5: '#60a5fa' },
  { name: 'Green',   accent: '#10d98a', accent2: '#f97316', accent3: '#38bdf8', accent4: '#fbbf24', accent5: '#a78bfa' },
  { name: 'Blue',    accent: '#3b82f6', accent2: '#a855f7', accent3: '#10d98a', accent4: '#fbbf24', accent5: '#f472b6' },
  { name: 'Custom',  accent: '',        accent2: '',        accent3: '',        accent4: '',        accent5: ''        },
]

export const FONT_OPTIONS = [
  { name: 'Figtree', value: "'Figtree', sans-serif" },
  { name: 'Inter',   value: "'Inter', sans-serif" },
  { name: 'System',  value: 'system-ui, sans-serif' },
  { name: 'DM Sans', value: "'DM Sans', sans-serif" },
  { name: 'Mono',    value: "'DM Mono', monospace" },
]

const DEFAULT_PROFILE = {
  displayName: '',
  paletteIdx: 0,
  customAccent: '#7c6dff',
  customAccent2: '#ff5f7e',
  customAccent3: '#3fe8a0',
  fontIdx: 0,
  fontSize: 14,
}

const NOTIFS_INIT = [
  { id: 1, type: 'new',    title: 'Welcome to ConvertLab!',     body: 'Built by Andre Matias — free, open-source, 28+ tools.', time: Date.now() - 3600000,   read: false },
  { id: 2, type: 'new',    title: 'AI powered by Pollinations', body: 'The AI tool uses Pollinations.ai — 100% free, no key needed.', time: Date.now() - 7200000, read: false },
  { id: 3, type: 'tip',    title: 'Favourite your tools',       body: 'Click the star on any tool to pin it to the sidebar.', time: Date.now() - 86400000,  read: false },
  { id: 4, type: 'tip',    title: 'Keyboard shortcuts',         body: 'Press Cmd+K to search, 1-9 to jump to tools, ? for all shortcuts.', time: Date.now() - 172800000, read: true },
  { id: 5, type: 'update', title: 'v2.0 launched',              body: 'PWA, shortcuts, custom themes, profiles, Pollinations AI and more.', time: Date.now() - 259200000, read: true },
]

export function AppProvider({ children }) {
  const [theme,         setThemeState]     = useState(() => localStorage.getItem('cl-theme') || 'dark')
  const [profile,       setProfileState]   = useState(() => { try { return { ...DEFAULT_PROFILE, ...JSON.parse(localStorage.getItem('cl-profile') || '{}') } } catch { return DEFAULT_PROFILE } })
  const [profileHash,   setProfileHash]    = useState(() => localStorage.getItem('cl-profile-hash') || '')
  const [sidebarOpen,   setSidebarOpen]    = useState(() => localStorage.getItem('cl-sidebar') !== 'false')
  const [favourites,    setFavourites]     = useState(() => { try { return JSON.parse(localStorage.getItem('cl-favs') || '[]') } catch { return [] } })
  const [history,       setHistory]        = useState(() => { try { return JSON.parse(localStorage.getItem('cl-history') || '[]') } catch { return [] } })
  const [notifications, setNotifications]  = useState(() => { try { return JSON.parse(localStorage.getItem('cl-notifs') || 'null') || NOTIFS_INIT } catch { return NOTIFS_INIT } })
  const [toasts,        setToasts]         = useState([])
  const [modal,         setModal]          = useState(null)

  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', theme)
    localStorage.setItem('cl-theme', theme)
    const pal = ACCENT_PALETTES[profile.paletteIdx] || ACCENT_PALETTES[0]
    const isCustom = pal.name === 'Custom'
    // For light theme, darken accents slightly for contrast
    const darken = (hex, amt) => {
      if (!hex) return hex
      const num = parseInt(hex.slice(1), 16)
      const r = Math.max(0, (num >> 16) - amt)
      const g = Math.max(0, ((num >> 8) & 0xff) - amt)
      const b = Math.max(0, (num & 0xff) - amt)
      return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')
    }
    const factor = theme === 'light' ? 20 : 0
    const applyAccent = (key, val) => {
      if (!val) return
      root.style.setProperty(key, factor ? darken(val, factor) : val)
    }
    if (isCustom) {
      applyAccent('--accent',  profile.customAccent)
      applyAccent('--accent2', profile.customAccent2)
      applyAccent('--accent3', profile.customAccent3)
    } else {
      applyAccent('--accent',  pal.accent)
      applyAccent('--accent2', pal.accent2)
      applyAccent('--accent3', pal.accent3)
      applyAccent('--accent4', pal.accent4)
      applyAccent('--accent5', pal.accent5)
    }
    root.style.setProperty('--sans', FONT_OPTIONS[profile.fontIdx]?.value || FONT_OPTIONS[0].value)
    document.body.style.fontSize = (profile.fontSize || 14) + 'px'
  }, [theme, profile])

  useEffect(() => { localStorage.setItem('cl-sidebar', sidebarOpen) }, [sidebarOpen])

  const toggleTheme  = useCallback(() => setThemeState(t => t === 'dark' ? 'light' : 'dark'), [])

  const saveProfile  = useCallback((updates) => {
    setProfileState(prev => { const next = { ...prev, ...updates }; localStorage.setItem('cl-profile', JSON.stringify(next)); return next })
  }, [])

  const setPassword  = useCallback(async (pwd) => {
    const h = await hashString(pwd); setProfileHash(h); localStorage.setItem('cl-profile-hash', h)
  }, [])

  const checkPassword = useCallback(async (pwd) => {
    const h = await hashString(pwd); return h === profileHash
  }, [profileHash])

  const toggleFav    = useCallback((id) => {
    setFavourites(prev => { const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]; localStorage.setItem('cl-favs', JSON.stringify(next)); return next })
  }, [])

  const recordUsage  = useCallback((toolId) => {
    setHistory(prev => {
      const existing = prev.find(h => h.id === toolId)
      const next = existing
        ? prev.map(h => h.id === toolId ? { ...h, count: h.count + 1, lastUsed: Date.now() } : h)
        : [...prev, { id: toolId, count: 1, lastUsed: Date.now(), firstUsed: Date.now() }]
      const sorted = [...next].sort((a, b) => b.count - a.count)
      localStorage.setItem('cl-history', JSON.stringify(sorted))
      return sorted
    })
  }, [])

  const markRead     = useCallback((id) => setNotifications(prev => { const n = prev.map(x => x.id === id ? { ...x, read: true } : x); localStorage.setItem('cl-notifs', JSON.stringify(n)); return n }), [])
  const markAllRead  = useCallback(() => setNotifications(prev => { const n = prev.map(x => ({ ...x, read: true })); localStorage.setItem('cl-notifs', JSON.stringify(n)); return n }), [])
  const addNotification = useCallback((notif) => setNotifications(prev => { const n = [{ id: Date.now(), read: false, time: Date.now(), ...notif }, ...prev]; localStorage.setItem('cl-notifs', JSON.stringify(n)); return n }), [])

  const showToast    = useCallback((msg, type = 'info') => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, msg, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 2800)
  }, [])

  const exportPresets = useCallback(() => {
    const data = { version: '2.0', exportedAt: new Date().toISOString(), exportedBy: profile.displayName || 'ConvertLab User', profile, theme, favourites }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    Object.assign(document.createElement('a'), { href: url, download: `convertlab-presets-${Date.now()}.json` }).click()
    URL.revokeObjectURL(url)
    showToast('Presets exported!', 'success')
  }, [profile, theme, favourites, showToast])

  const importPresets = useCallback((file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        if (data.profile) saveProfile(data.profile)
        if (data.theme) { setThemeState(data.theme); localStorage.setItem('cl-theme', data.theme) }
        if (data.favourites) { setFavourites(data.favourites); localStorage.setItem('cl-favs', JSON.stringify(data.favourites)) }
        showToast('Presets imported from ' + (data.exportedBy || 'file') + '!', 'success')
      } catch { showToast('Invalid presets file', 'err') }
    }
    reader.readAsText(file)
  }, [saveProfile, showToast])

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      profile, saveProfile, setPassword, checkPassword, profileHash,
      sidebarOpen, setSidebarOpen,
      favourites, toggleFav,
      history, recordUsage,
      notifications, unreadCount, markRead, markAllRead, addNotification,
      toasts, showToast,
      modal, setModal,
      exportPresets, importPresets,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
