
export const ACCENT_PALETTES = [
  { name: 'Purple', accent: '#7c6dff', accent2: '#ff5f7e', accent3: '#3fe8a0' },
  { name: 'Cyan', accent: '#00cec9', accent2: '#fd79a8', accent3: '#55efc4' },
  { name: 'Orange', accent: '#fd9a00', accent2: '#e17055', accent3: '#ffeaa7' },
  { name: 'Rose', accent: '#e84393', accent2: '#fd79a8', accent3: '#74b9ff' },
  { name: 'Green', accent: '#00b894', accent2: '#fdcb6e', accent3: '#55efc4' },
  { name: 'Blue', accent: '#0984e3', accent2: '#6c5ce7', accent3: '#74b9ff' },
  { name: 'Custom', accent: '', accent2: '', accent3: '' },
]

export const FONT_OPTIONS = [
  { name: 'Figtree', value: "'Figtree', sans-serif" },
  { name: 'Inter', value: "'Inter', sans-serif" },
  { name: 'System', value: 'system-ui, sans-serif' },
  { name: 'DM Sans', value: "'DM Sans', sans-serif" },
  { name: 'Mono', value: "'DM Mono', monospace" },
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
  { id: 1, type: 'new', title: 'Welcome to ConvertLab!', body: 'Built by Andre Matias — free, open-source, 28+ tools.', time: Date.now() - 3600000, read: false },
  { id: 2, type: 'new', title: 'AI powered by Pollinations', body: 'The AI tool uses Pollinations.ai — 100% free, no key needed.', time: Date.now() - 7200000, read: false },
  { id: 3, type: 'tip', title: 'Favourite your tools', body: 'Click the star on any tool to pin it to the sidebar.', time: Date.now() - 86400000, read: false },
  { id: 4, type: 'tip', title: 'Keyboard shortcuts', body: 'Press Cmd+K to search, 1-9 to jump to tools, ? for all shortcuts.', time: Date.now() - 172800000, read: true },
  { id: 5, type: 'update', title: 'v2.0 launched', body: 'PWA, shortcuts, custom themes, profiles, Pollinations AI and more.', time: Date.now() - 259200000, read: true },
]