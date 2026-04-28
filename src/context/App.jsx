import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AppContext = createContext(null)

async function hashString(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}


export function AppProvider({ children }) {
  const [theme, setThemeState] = useState(() => localStorage.getItem('cl-theme') || 'dark')
  const [profile, setProfileState] = useState(() => { try { return { ...DEFAULT_PROFILE, ...JSON.parse(localStorage.getItem('cl-profile') || '{}') } } catch { return DEFAULT_PROFILE } })
  const [profileHash, setProfileHash] = useState(() => localStorage.getItem('cl-profile-hash') || '')
  const [sidebarOpen, setSidebarOpen] = useState(() => localStorage.getItem('cl-sidebar') !== 'false')
  const [favourites, setFavourites] = useState(() => { try { return JSON.parse(localStorage.getItem('cl-favs') || '[]') } catch { return [] } })
  const [history, setHistory] = useState(() => { try { return JSON.parse(localStorage.getItem('cl-history') || '[]') } catch { return [] } })
  const [notifications, setNotifications] = useState(() => { try { return JSON.parse(localStorage.getItem('cl-notifs') || 'null') || NOTIFS_INIT } catch { return NOTIFS_INIT } })
  const [toasts, setToasts] = useState([])
  const [modal, setModal] = useState(null)

  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', theme)
    localStorage.setItem('cl-theme', theme)
    const pal = ACCENT_PALETTES[profile.paletteIdx] || ACCENT_PALETTES[0]
    const isCustom = pal.name === 'Custom'
    root.style.setProperty('--accent', isCustom ? profile.customAccent : pal.accent)
    root.style.setProperty('--accent2', isCustom ? profile.customAccent2 : pal.accent2)
    root.style.setProperty('--accent3', isCustom ? profile.customAccent3 : pal.accent3)
    root.style.setProperty('--sans', FONT_OPTIONS[profile.fontIdx]?.value || FONT_OPTIONS[0].value)
    document.body.style.fontSize = (profile.fontSize || 14) + 'px'
  }, [theme, profile])

  useEffect(() => { localStorage.setItem('cl-sidebar', sidebarOpen) }, [sidebarOpen])

  const toggleTheme = useCallback(() => setThemeState(t => t === 'dark' ? 'light' : 'dark'), [])

  const saveProfile = useCallback((updates) => {
    setProfileState(prev => { const next = { ...prev, ...updates }; localStorage.setItem('cl-profile', JSON.stringify(next)); return next })
  }, [])

  const setPassword = useCallback(async (pwd) => {
    const h = await hashString(pwd); setProfileHash(h); localStorage.setItem('cl-profile-hash', h)
  }, [])

  const checkPassword = useCallback(async (pwd) => {
    const h = await hashString(pwd); return h === profileHash
  }, [profileHash])

  const toggleFav = useCallback((id) => {
    setFavourites(prev => { const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]; localStorage.setItem('cl-favs', JSON.stringify(next)); return next })
  }, [])

  const recordUsage = useCallback((toolId) => {
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

  const markRead = useCallback((id) => setNotifications(prev => { const n = prev.map(x => x.id === id ? { ...x, read: true } : x); localStorage.setItem('cl-notifs', JSON.stringify(n)); return n }), [])
  const markAllRead = useCallback(() => setNotifications(prev => { const n = prev.map(x => ({ ...x, read: true })); localStorage.setItem('cl-notifs', JSON.stringify(n)); return n }), [])
  const addNotification = useCallback((notif) => setNotifications(prev => { const n = [{ id: Date.now(), read: false, time: Date.now(), ...notif }, ...prev]; localStorage.setItem('cl-notifs', JSON.stringify(n)); return n }), [])

  const showToast = useCallback((msg, type = 'info') => {
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
