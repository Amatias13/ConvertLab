export const TOOLS = [
  {
    section: "Data",
    items: [
      { id: "json", label: "JSON Formatter", icon: "{ }", color: "#7c6dff" },
      { id: "base64", label: "Base64", icon: "64", color: "#38b6ff" },
      { id: "url", label: "URL Encoder", icon: "⌁", color: "#ffba3b" },
      { id: "hash", label: "Hash Generator", icon: "#", color: "#3fe8a0" },
      { id: "jwt", label: "JWT Decoder", icon: "J", color: "#ff5f7e" },
      { id: "base", label: "Number Base", icon: "2↔", color: "#a29bfe" },
      { id: "csv", label: "CSV Viewer", icon: "▦", color: "#fd9a00" },
      { id: "yaml", label: "YAML ↔ JSON", icon: "Y↔J", color: "#00cec9" },
    ],
  },
  {
    section: "Preview",
    items: [
      { id: "markdown", label: "Markdown", icon: "M↓", color: "#b2bec3" },
      { id: "html", label: "HTML Preview", icon: "</>", color: "#e17055" },
      { id: "email", label: "Email Preview", icon: "✉", color: "#55efc4" },
      { id: "sql", label: "SQL Formatter", icon: "⊹", color: "#fdcb6e" },
    ],
  },
  {
    section: "Text",
    items: [
      { id: "regex", label: "Regex Tester", icon: ".*", color: "#fd79a8" },
      { id: "diff", label: "Text Diff", icon: "≠", color: "#6c5ce7" },
      { id: "caseconv", label: "Case Converter", icon: "Aa", color: "#ff5f7e" },
      { id: "entities", label: "HTML Entities", icon: "&", color: "#38b6ff" },
      { id: "textstats", label: "Text Statistics", icon: "≡", color: "#3fe8a0" },
    ],
  },
  {
    section: "Generators",
    items: [
      { id: "uuid", label: "UUID Generator", icon: "⊛", color: "#38b6ff" },
      { id: "lorem", label: "Lorem Ipsum", icon: "¶", color: "#3fe8a0" },
      { id: "password", label: "Password Generator", icon: "🔑", color: "#ff5f7e" },
      { id: "cron", label: "Cron Parser", icon: "⌚", color: "#7c6dff" },
    ],
  },
  {
    section: "Converters",
    items: [
      { id: "timestamp", label: "Timestamp", icon: "⏱", color: "#ffba3b" },
      { id: "units", label: "Unit Converter", icon: "⇄", color: "#a29bfe" },
      { id: "numfmt", label: "Number Formatter", icon: "1k", color: "#fdcb6e" },
    ],
  },
  {
    section: "Media & Color",
    items: [
      { id: "image", label: "Image Tools", icon: "⊞", color: "#55efc4" },
      { id: "color", label: "Color Picker", icon: "◉", color: "#fd79a8" },
      { id: "qr", label: "QR Code", icon: "▣", color: "#a29bfe" },
    ],
  },
];

export const ALL_TOOLS = TOOLS.flatMap((g) => g.items);
