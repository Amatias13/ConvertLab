import { describe, it, expect } from "vitest";

// Inline the RFC 4180 parser from CsvTool (defined inside useMemo, not exported)
function parseCsv(text, sep = ",") {
  const rows = [];
  let row = [], field = "", inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') inQuotes = false;
      else field += ch;
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === sep) {
      row.push(field.trim()); field = "";
    } else if (ch === "\n" || (ch === "\r" && text[i + 1] === "\n")) {
      if (ch === "\r") i++;
      row.push(field.trim()); rows.push(row); row = []; field = "";
    } else {
      field += ch;
    }
  }
  row.push(field.trim());
  if (row.some(Boolean)) rows.push(row);
  return rows;
}

describe("parseCsv — basic", () => {
  it("parses a single row", () => {
    expect(parseCsv("a,b,c")).toEqual([["a", "b", "c"]]);
  });

  it("parses multiple rows", () => {
    expect(parseCsv("a,b\nc,d")).toEqual([["a", "b"], ["c", "d"]]);
  });

  it("trims whitespace around fields", () => {
    expect(parseCsv("a , b , c")).toEqual([["a", "b", "c"]]);
  });

  it("handles empty fields", () => {
    expect(parseCsv("a,,c")).toEqual([["a", "", "c"]]);
  });

  it("handles CRLF line endings", () => {
    expect(parseCsv("a,b\r\nc,d")).toEqual([["a", "b"], ["c", "d"]]);
  });
});

describe("parseCsv — quoted fields", () => {
  it("handles quoted field containing the delimiter", () => {
    expect(parseCsv('"New York, NY",US')).toEqual([["New York, NY", "US"]]);
  });

  it("handles escaped double quotes inside quoted field", () => {
    expect(parseCsv('"say ""hello""",world')).toEqual([['say "hello"', "world"]]);
  });

  it("handles quoted field with newline inside", () => {
    expect(parseCsv('"line1\nline2",b')).toEqual([["line1\nline2", "b"]]);
  });

  it("handles fully quoted row", () => {
    expect(parseCsv('"a","b","c"')).toEqual([["a", "b", "c"]]);
  });
});

describe("parseCsv — custom delimiter", () => {
  it("uses semicolon as delimiter", () => {
    expect(parseCsv("a;b;c", ";")).toEqual([["a", "b", "c"]]);
  });

  it("uses tab as delimiter", () => {
    expect(parseCsv("a\tb\tc", "\t")).toEqual([["a", "b", "c"]]);
  });
});

describe("parseCsv — edge cases", () => {
  it("returns empty array for empty string", () => {
    expect(parseCsv("")).toEqual([]);
  });

  it("ignores trailing empty rows", () => {
    const result = parseCsv("a,b\n");
    expect(result).toEqual([["a", "b"]]);
  });

  it("handles single column with multiple rows", () => {
    expect(parseCsv("a\nb\nc")).toEqual([["a"], ["b"], ["c"]]);
  });
});
