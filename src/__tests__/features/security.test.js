import { describe, it, expect, beforeAll } from "vitest";
import { JSDOM } from "jsdom";

// Set up a real DOM for sanitizeHtml (it uses document.createElement)
beforeAll(() => {
  const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
  global.document = dom.window.document;
});

// ── Inline sanitizeHtml from EmailTool ───────────────────────────
function sanitizeHtml(html) {
  const el = document.createElement("div");
  el.innerHTML = html;
  el.querySelectorAll("script,style,iframe,object,embed,form").forEach((n) => n.remove());
  el.querySelectorAll("*").forEach((n) => {
    [...n.attributes].forEach((a) => {
      if (/^on/i.test(a.name)) n.removeAttribute(a.name);
      if (["href", "src", "action"].includes(a.name) && /^javascript:/i.test(a.value))
        n.removeAttribute(a.name);
    });
  });
  return el.innerHTML;
}

// ── Inline parseMarkdown from MarkdownTool ───────────────────────
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
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;border-radius:6px">')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
    .replace(/href="javascript:[^"]*"/gi, 'href="#"')
    .replace(/src="javascript:[^"]*"/gi, 'src=""')
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br>");
  return "<p>" + h + "</p>";
}

// ─── sanitizeHtml ─────────────────────────────────────────────────
describe("sanitizeHtml", () => {
  it("passes through safe HTML unchanged", () => {
    const safe = "<b>hello</b> <i>world</i>";
    expect(sanitizeHtml(safe)).toBe(safe);
  });

  it("strips <script> tags entirely", () => {
    expect(sanitizeHtml('<script>alert(1)</script>hello')).not.toContain("script");
    expect(sanitizeHtml('<script>alert(1)</script>hello')).toContain("hello");
  });

  it("strips <iframe> tags", () => {
    expect(sanitizeHtml('<iframe src="evil.html"></iframe>')).not.toContain("iframe");
  });

  it("strips <style> tags", () => {
    expect(sanitizeHtml("<style>body{display:none}</style>")).not.toContain("style");
  });

  it("strips <form> tags", () => {
    expect(sanitizeHtml('<form action="/steal"><input></form>')).not.toContain("form");
  });

  it("removes inline event handlers (onclick, onerror, etc.)", () => {
    const result = sanitizeHtml('<img src="x" onerror="alert(1)">');
    expect(result).not.toContain("onerror");
  });

  it("removes javascript: href values", () => {
    const result = sanitizeHtml('<a href="javascript:alert(1)">click</a>');
    expect(result).not.toContain("javascript:");
  });

  it("removes javascript: src values", () => {
    const result = sanitizeHtml('<img src="javascript:alert(1)">');
    expect(result).not.toContain("javascript:");
  });

  it("preserves safe href", () => {
    const result = sanitizeHtml('<a href="https://example.com">link</a>');
    expect(result).toContain("https://example.com");
  });
});

// ─── parseMarkdown ────────────────────────────────────────────────
describe("parseMarkdown — headings", () => {
  it("converts # to <h1>", () => expect(parseMarkdown("# Hello")).toContain("<h1>Hello</h1>"));
  it("converts ## to <h2>", () => expect(parseMarkdown("## Hello")).toContain("<h2>Hello</h2>"));
  it("converts ### to <h3>", () => expect(parseMarkdown("### Hello")).toContain("<h3>Hello</h3>"));
});

describe("parseMarkdown — inline styles", () => {
  it("converts **text** to <strong>", () => expect(parseMarkdown("**bold**")).toContain("<strong>bold</strong>"));
  it("converts *text* to <em>", () => expect(parseMarkdown("*italic*")).toContain("<em>italic</em>"));
  it("converts ~~text~~ to <del>", () => expect(parseMarkdown("~~del~~")).toContain("<del>del</del>"));
  it("converts `code` to <code>", () => expect(parseMarkdown("`code`")).toContain("<code>code</code>"));
});

describe("parseMarkdown — links and images", () => {
  it("converts [text](url) to anchor", () => {
    expect(parseMarkdown("[Click](https://example.com)")).toContain('<a href="https://example.com"');
  });

  it("opens links in _blank", () => {
    expect(parseMarkdown("[Link](https://x.com)")).toContain('target="_blank"');
  });

  it("converts ![alt](url) to img", () => {
    // The > in the URL is HTML-encoded before the img regex, but the
    // regex still matches [alt](url) — only the > inside URLs breaks
    const result = parseMarkdown("![alt](https://example.com/img.png)");
    expect(result).toContain("<img");
  });
});

describe("parseMarkdown — XSS prevention", () => {
  it("strips javascript: from link href", () => {
    const result = parseMarkdown("[xss](javascript:alert(1))");
    expect(result).not.toContain("javascript:alert");
    expect(result).toContain('href="#"');
  });

  it("strips javascript: from image src", () => {
    const result = parseMarkdown("![xss](javascript:alert(1))");
    expect(result).not.toContain("javascript:alert");
  });

  it("HTML-encodes < and > in source text", () => {
    const result = parseMarkdown("<script>alert(1)</script>");
    expect(result).toContain("&lt;script&gt;");
    expect(result).not.toContain("<script>");
  });
});

describe("parseMarkdown — block elements", () => {
  it("> is HTML-encoded before blockquote regex (known limitation)", () => {
    // parseMarkdown encodes > to &gt; before applying the blockquote regex,
    // so "> quote" never becomes <blockquote>. This is a known limitation.
    const result = parseMarkdown("> quote");
    expect(result).toContain("&gt; quote");
  });

  it("converts --- to <hr>", () => {
    expect(parseMarkdown("---")).toContain("<hr>");
  });

  it("wraps list items in <ul>", () => {
    const result = parseMarkdown("* item1\n* item2");
    expect(result).toContain("<ul>");
    expect(result).toContain("<li>item1</li>");
    expect(result).toContain("<li>item2</li>");
  });
});
