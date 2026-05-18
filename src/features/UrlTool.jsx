import { useState } from "react";
import { ToolHeader, Panels, Panel0, Panel, PanelLabel, OptionsBar, Btn, CodeArea } from "../components/UI";
import { useApp } from "../context/AppContext";
import { useClipboard } from "../hooks/useClipboard";

function escHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export default function UrlTool() {
  const { showToast } = useApp();
  const { copy } = useClipboard();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [parsed, setParsed] = useState([]);

  const handleInput = (val) => {
    setInput(val);
    setOutput(encodeURIComponent(val));
    try {
      const u = new URL(val);
      const parts = [
        ["Protocol", u.protocol],
        ["Host", u.host],
        ["Pathname", u.pathname],
        ["Search", u.search],
        ["Hash", u.hash],
      ].filter(([, v]) => v);
      const params = [];
      u.searchParams.forEach((v, k) => params.push([`  ?${k}`, v]));
      setParsed([...parts, ...params]);
    } catch {
      setParsed([]);
    }
  };

  const decode = () => {
    try {
      setInput(decodeURIComponent(output));
    } catch {
      showToast("Invalid encoded URL");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
      <ToolHeader title="URL Encoder / Decoder" desc="Encode/decode URLs and parse query strings">
        <Btn onClick={() => setOutput(encodeURIComponent(input))} primary>
          Encode →
        </Btn>
        <Btn onClick={decode}>← Decode</Btn>
      </ToolHeader>

      <OptionsBar>
        <div style={{ marginLeft: "auto" }}>
          <Btn
            onClick={() => {
              copy(output, "Copied");
            }}
          >
            Copy
          </Btn>
        </div>
      </OptionsBar>

      <Panels>
        <Panel0>
          <PanelLabel>Input</PanelLabel>
          <CodeArea value={input} onChange={handleInput} placeholder="Paste a URL or text to encode/decode..." mono={false} />
        </Panel0>

        <Panel style={{ flexDirection: "column" }}>
          <PanelLabel>Encoded / Decoded</PanelLabel>
          <div style={{ flex: "0 0 auto", borderBottom: "1px solid var(--border)" }}>
            <CodeArea value={output} onChange={setOutput} placeholder="Result..." style={{ height: 80, flex: "none" }} />
          </div>
          <PanelLabel>Parsed URL parts</PanelLabel>
          <div style={{ flex: 1, overflow: "auto" }}>
            {parsed.length > 0 ? (
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--mono)", fontSize: 12 }}>
                <tbody>
                  {parsed.map(([k, v], i) => (
                    <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "0.5rem 1rem", color: "var(--text3)", whiteSpace: "nowrap", verticalAlign: "top" }}>{k}</td>
                      <td style={{ padding: "0.5rem 1rem", color: "var(--text)", wordBreak: "break-all" }}>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: "1rem", fontSize: 12, color: "var(--text3)" }}>Enter a valid URL to parse its parts</div>
            )}
          </div>
        </Panel>
      </Panels>
    </div>
  );
}
