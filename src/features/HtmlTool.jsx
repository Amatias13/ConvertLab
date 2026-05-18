import { useState, useRef, useEffect } from "react";
import { ToolHeader, Panels, Panel0, Panel, PanelLabel, OptionsBar, OptLabel, OptGroup, OptBtn, Btn, CodeArea } from "../components/UI";

const PLACEHOLDER = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; padding: 2rem; background: #f9f9f9; }
    h1 { color: #6c63ff; }
    button { background: #6c63ff; color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; }
  </style>
</head>
<body>
  <h1>Hello from ConvertLab!</h1>
  <p>Edit the HTML on the left to see it render here.</p>
  <button onclick="alert('It works!')">Click me</button>
</body>
</html>`;

export default function HtmlTool() {
  const [input, setInput] = useState(PLACEHOLDER);
  const [bg, setBg] = useState("white");
  const iframeRef = useRef(null);

  useEffect(() => {
    const blob = new Blob([input], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    if (iframeRef.current) iframeRef.current.src = url;
    return () => URL.revokeObjectURL(url);
  }, [input]);

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
      <ToolHeader title="HTML Preview" desc="Render HTML in a sandboxed iframe" />

      <OptionsBar>
        <OptLabel>Preview bg:</OptLabel>
        <OptGroup>
          {["white", "#1a1a2e", "transparent"].map((c) => (
            <OptBtn key={c} active={bg === c} onClick={() => setBg(c)}>
              {c === "white" ? "Light" : c === "transparent" ? "None" : "Dark"}
            </OptBtn>
          ))}
        </OptGroup>
      </OptionsBar>

      <Panels>
        <Panel0>
          <PanelLabel>HTML Source</PanelLabel>
          <CodeArea value={input} onChange={setInput} placeholder="<h1>Hello World</h1>" />
        </Panel0>

        <Panel>
          <PanelLabel>Preview</PanelLabel>
          <iframe ref={iframeRef} sandbox="allow-scripts" style={{ flex: 1, border: "none", background: bg }} />
        </Panel>
      </Panels>
    </div>
  );
}
