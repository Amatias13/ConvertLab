import { useState, useMemo } from "react";
import { ToolHeader, Panels, Panel0, Panel, PanelLabel, OptionsBar, OptLabel, OptGroup, OptBtn, Btn, CodeArea } from "../components/UI";
import { useClipboard } from "../hooks/useClipboard";
import { DELIMITERS } from "../constants/tools";

export default function CsvTool() {
  const { copy } = useClipboard();
  const [raw, setRaw] = useState("");
  const [delim, setDelim] = useState(",");
  const [sort, setSort] = useState(null); // {col, dir}

  const parsed = useMemo(() => {
    if (!raw.trim()) return null;
    const rows = raw
      .trim()
      .split("\n")
      .map((r) => r.split(delim).map((c) => c.trim().replace(/^"|"$/g, "")));
    return { headers: rows[0], data: rows.slice(1) };
  }, [raw, delim]);

  const sortedData = useMemo(() => {
    if (!parsed || !sort) return parsed?.data || [];
    const idx = parsed.headers.indexOf(sort.col);
    return [...parsed.data].sort((a, b) => {
      const av = a[idx] ?? "",
        bv = b[idx] ?? "";
      const n = Number(av) - Number(bv);
      const cmp = isNaN(n) ? av.localeCompare(bv) : n;
      return sort.dir === "asc" ? cmp : -cmp;
    });
  }, [parsed, sort]);

  const toggleSort = (col) => {
    setSort((prev) => {
      if (prev?.col === col) return { col, dir: prev.dir === "asc" ? "desc" : "asc" };
      return { col, dir: "asc" };
    });
  };

  return (
    <div className="tool-wrap">
      <ToolHeader title="CSV Viewer" desc="Paste CSV and view as interactive table">
        <Btn
          onClick={() => {
            copy(raw, "Copied");
          }}
        >
          Copy
        </Btn>
      </ToolHeader>

      <OptionsBar>
        <OptLabel>Delimiter:</OptLabel>
        <OptGroup>
          {DELIMITERS.map((d) => (
            <OptBtn key={d.value} active={delim === d.value} onClick={() => setDelim(d.value)}>
              {d.label}
            </OptBtn>
          ))}
        </OptGroup>
        {parsed && (
          <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--text3)" }}>
            {parsed.data.length + 1} rows · {parsed.headers.length} cols
          </span>
        )}
      </OptionsBar>

      <Panels>
        <Panel0 style={{ maxWidth: 280 }}>
          <PanelLabel>CSV Input</PanelLabel>
          <CodeArea value={raw} onChange={setRaw} placeholder={"name,age,city\nAlice,30,Lisbon\nBob,25,Porto"} />
        </Panel0>

        <Panel>
          <PanelLabel>Table View</PanelLabel>
          <div style={{ flex: 1, overflow: "auto", padding: "0.75rem" }}>
            {!parsed ? (
              <div style={{ fontSize: 12, color: "var(--text3)", padding: "0.25rem" }}>Paste CSV to view as table</div>
            ) : (
              <table style={{ borderCollapse: "collapse", fontSize: 12, width: "100%", fontFamily: "var(--mono)" }}>
                <thead>
                  <tr>
                    {parsed.headers.map((h, i) => (
                      <th
                        key={i}
                        onClick={() => toggleSort(h)}
                        style={{
                          background: "var(--bg3)",
                          border: "1px solid var(--border)",
                          padding: "0.4rem 0.75rem",
                          fontWeight: 600,
                          textAlign: "left",
                          color: "var(--text2)",
                          cursor: "pointer",
                          userSelect: "none",
                          position: "sticky",
                          top: 0,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h} {sort?.col === h ? (sort.dir === "asc" ? "↑" : "↓") : ""}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map((row, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "var(--bg2)" }}>
                      {parsed.headers.map((_, j) => (
                        <td key={j} style={{ border: "1px solid var(--border)", padding: "0.35rem 0.75rem", color: "var(--text)" }}>
                          {row[j] ?? ""}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Panel>
      </Panels>
    </div>
  );
}
