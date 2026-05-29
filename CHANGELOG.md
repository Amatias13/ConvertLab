# Changelog

All notable changes to ConvertLab are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [2.0.0] — 2025

### Added

- PWA support — install on desktop/mobile, works fully offline
- Keyboard shortcuts: ⌘K search, 1–9 tool jump, ⌘B sidebar, ⌘D theme, ⌘, settings, ?
- Profile system — persistent settings, export/import presets across devices
- 6 accent colour palettes + custom colour picker (syncs with Color Picker tool)
- Password-protected profile lock
- AI Text Enhancer powered by [Pollinations.ai](https://pollinations.ai) — free, no API key
- Feedback system via EmailJS (bug reports, feature requests, praise)
- Notification centre with tips and update announcements
- Tool usage history tracking
- Favorites — pin tools to the sidebar
- Tool search (⌘K) with fuzzy matching across name, description, and keywords
- New tools: SQL Formatter, Number Formatter, Unit Converter, Image Tools, Email Preview, YAML ↔ JSON
- Dark/light theme with smooth transition

### Changed

- Complete UI redesign — new design system with CSS custom properties
- All tool logic extracted to pure helpers in `src/helpers/` for testability
- CSV parser upgraded to full RFC 4180 compliance (handles quoted fields with delimiters)
- Markdown renderer strips `javascript:` URLs from links and images
- Email Preview sanitizes HTML before rendering

### Fixed

- JSON Formatter: format button no longer has stale-closure on indent change
- Cron Parser: debounced input prevents main-thread block on invalid expressions
- QR Code: colours now follow dark/light theme
- Profile export: anchor element properly appended to DOM before click (Firefox fix)
- Escape key now closes all modals, not only the shortcuts panel
- Clear History now updates React state immediately without page reload

---

## [1.0.0] — 2024

### Added

- Initial release with 20 developer tools
- Dark/light theme toggle
- localStorage persistence
- GitHub Pages deployment via GitHub Actions
