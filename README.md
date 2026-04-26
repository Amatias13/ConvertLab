# ConvertLab

> One tool for every transformation.

A fast, privacy-first, offline-capable multi-tool app built with React + Vite.  
All transformations happen in your browser — no data is ever sent to a server.

## 🛠 Tools included (20+)

**Data**
- JSON Formatter & Validator
- Base64 Encoder/Decoder
- URL Encoder/Decoder & Parser
- Hash Generator (SHA-1/256/384/512)
- JWT Decoder
- Number Base Converter (Bin/Oct/Dec/Hex + custom)
- CSV Viewer with sorting

**Preview**
- Markdown Preview (live)
- HTML Preview (sandboxed iframe)
- Email Preview

**Text**
- Regex Tester with live highlighting
- Text Diff (line-by-line)
- Case Converter (camelCase, snake_case, kebab, Pascal, and more)

**Generators**
- UUID Generator (v4, NanoID, tokens)
- Lorem Ipsum Generator
- Cron Expression Parser
- QR Code Generator

**Media & Color**
- Image Tools (convert, filter, download)
- Color Picker & Converter (HEX/RGB/HSL + palettes)
- Timestamp Converter

## 🚀 Deploy to GitHub Pages

1. Fork or clone this repo
2. Go to **Settings → Pages**
3. Set source to **GitHub Actions**
4. Push to `main` — the workflow handles the rest

The site will be live at `https://<your-username>.github.io/convertlab/`

## 🧑‍💻 Local development

```bash
npm install
npm run dev
```

## 🏗 Build

```bash
npm run build
```

Output goes to `dist/`.

## Tech stack

- [React 19](https://react.dev)
- [Vite 8](https://vite.dev)
- [Lucide React](https://lucide.dev) (icons)
- Zero external runtime dependencies

## License

MIT
