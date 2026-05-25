import { useState } from "react";
import { ToolHeader, Panels, Panel0, Panel, PanelLabel, Btn, CodeArea } from "../components/UI";
import { useClipboard } from "../hooks/useClipboard";

function parseMarkdown(md) {
  let h = md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/```(\w*)\n?([\s\S]*?)```/g, '<pre><code class="lang-$1">$2</code></pre>')
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/^#{6}\s+(.+)$/gm, "<h6>$1</h6>")
    .replace(/^#{5}\s+(.+)$/gm, "<h5>$1</h5>")
    .replace(/^#{4}\s+(.+)$/gm, "<h4>$1</h4>")
    .replace(/^#{3}\s+(.+)$/gm, "<h3>$1</h3>")
    .replace(/^#{2}\s+(.+)$/gm, "<h2>$1</h2>")
    .replace(/^#{1}\s+(.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/~~(.+?)~~/g, "<del>$1</del>")
    .replace(/^>\s+(.+)$/gm, "<blockquote>$1</blockquote>")
    .replace(/^---+$/gm, "<hr>")
    .replace(/^\*\s+(.+)$/gm, "<li>$1</li>")
    .replace(/^\d+\.\s+(.+)$/gm, "<li>$1</li>")
    .replace(/(<li>[\s\S]*?<\/li>\n?)+/g, (s) => `<ul>${s}</ul>`)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;border-radius:6px">')
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br>");
  return "<p>" + h + "</p>";
}

const PREVIEW_STYLE = `
  font-family: var(--sans); font-size: 14px; line-height: 1.75; color: var(--text);
  h1,h2,h3,h4,h5,h6 { font-family: var(--display); margin: 1.25rem 0 0.5rem; font-weight: 700; }
  h1 { font-size: 1.6rem; } h2 { font-size: 1.25rem; } h3 { font-size: 1.05rem; }
  p { margin: 0.6rem 0; }
  code { font-family: var(--mono); font-size: 12px; background: var(--bg3); padding: 1px 5px; border-radius: 4px; }
  pre { background: var(--bg3); border: 1px solid var(--border); border-radius: 8px; padding: 1rem; margin: 0.75rem 0; overflow: auto; }
  pre code { background: none; padding: 0; }
  blockquote { border-left: 3px solid var(--accent); padding-left: 1rem; color: var(--text2); margin: 0.75rem 0; }
  table { width: 100%; border-collapse: collapse; margin: 0.75rem 0; }
  td, th { border: 1px solid var(--border2); padding: 0.4rem 0.75rem; }
  th { background: var(--bg3); font-weight: 600; }
  a { color: var(--accent5); }
  ul, ol { padding-left: 1.5rem; margin: 0.5rem 0; }
  hr { border: none; border-top: 1px solid var(--border); margin: 1rem 0; }
  del { opacity: 0.5; }
`;

const PLACEHOLDER = `# Welcome to Markdown Preview

Write **markdown** here and see it rendered *live*.

## Features
- Headers (H1–H6)
- **Bold** and *italic*
- \`inline code\` and code blocks
- [Links](https://github.com) and images
- > Blockquotes
- Tables, lists, and more

\`\`\`js
const greet = name => \`Hello, \${name}!\`
\`\`\`
`;

export default function MarkdownTool() {
  const { copy } = useClipboard();
  const [input, setInput] = useState(PLACEHOLDER);

  const wordCount = input.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="tool-wrap">
      <ToolHeader title="Markdown Preview" desc="Real-time Markdown rendering">
        <Btn
          onClick={() => {
            copy(input, "Copied");
          }}
        >
          Copy source
        </Btn>
      </ToolHeader>

      <Panels>
        <Panel0>
          <PanelLabel right={`${wordCount} words`}>Markdown</PanelLabel>
          <CodeArea value={input} onChange={setInput} placeholder="Write markdown here..." />
        </Panel0>

        <Panel>
          <PanelLabel>Preview</PanelLabel>
          <div style={{ flex: 1, overflow: "auto", padding: "1.5rem" }}>
            <style>
              {PREVIEW_STYLE.split("\n")
                .map((l) => l.trim())
                .join(" ")}
            </style>
            <div dangerouslySetInnerHTML={{ __html: parseMarkdown(input) }} />
          </div>
        </Panel>
      </Panels>
    </div>
  );
}
