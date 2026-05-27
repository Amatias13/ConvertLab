import { useState, useEffect, useCallback } from "react";
import { ToolHeader, Panels, Panel0, PanelLabel, OptionsBar, OptLabel, OptGroup, OptBtn, Btn, CodeArea } from "../components/UI";
import { useClipboard } from "../hooks/useClipboard";
import { LOREM_WORDS } from "../constants/tools";

const rw = () => LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
const sentence = () => {
  const ws = Array.from({ length: 8 + Math.floor(Math.random() * 10) }, rw);
  return ws[0][0].toUpperCase() + ws.join(" ").slice(1) + ".";
};
const paragraph = () => Array.from({ length: 3 + Math.floor(Math.random() * 4) }, sentence).join(" ");

export default function LoremTool() {
  const { copy } = useClipboard();
  const [type, setType] = useState("paragraphs");
  const [count, setCount] = useState(3);
  const [classic, setClassic] = useState(false);
  const [output, setOutput] = useState("");

  const generate = useCallback(() => {
    let result;
    if (type === "paragraphs") {
      const ps = Array.from({ length: count }, paragraph);
      if (classic) ps[0] = "Lorem ipsum dolor sit amet. " + paragraph();
      result = ps.join("\n\n");
    } else if (type === "sentences") {
      const ss = Array.from({ length: count }, sentence);
      if (classic) ss[0] = "Lorem ipsum dolor sit amet.";
      result = ss.join(" ");
    } else {
      const ws = Array.from({ length: count }, rw);
      if (classic) ws[0] = "lorem";
      result = ws.join(" ");
    }
    setOutput(result);
  }, [type, count, classic]);

  useEffect(() => {
    generate();
  }, [generate]);

  const wc = output.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="tool-wrap">
      <ToolHeader title="Lorem Ipsum Generator" desc="Generate placeholder text in various formats">
        <Btn
          onClick={() => {
            copy(output, "Copied");
          }}
        >
          Copy
        </Btn>
        <Btn onClick={generate} primary>
          Regenerate
        </Btn>
      </ToolHeader>

      <OptionsBar>
        <OptLabel>Type:</OptLabel>
        <OptGroup>
          {[
            ["paragraphs", "Paragraphs"],
            ["sentences", "Sentences"],
            ["words", "Words"],
          ].map(([v, l]) => (
            <OptBtn key={v} active={type === v} onClick={() => setType(v)}>
              {l}
            </OptBtn>
          ))}
        </OptGroup>
        <OptLabel style={{ marginLeft: "0.75rem" }}>Count:</OptLabel>
        <OptGroup>
          {[3, 5, 10, 20].map((n) => (
            <OptBtn key={n} active={count === n} onClick={() => setCount(n)}>
              {n}
            </OptBtn>
          ))}
        </OptGroup>
        <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--text2)", marginLeft: "0.75rem", cursor: "pointer" }}>
          <input type="checkbox" checked={classic} onChange={(e) => setClassic(e.target.checked)} style={{ accentColor: "var(--accent)" }} />
          Start with "Lorem ipsum"
        </label>
      </OptionsBar>

      <Panels>
        <Panel0>
          <PanelLabel right={`${wc} words · ${output.length} chars`}>Output</PanelLabel>
          <CodeArea value={output} readOnly mono={false} />
        </Panel0>
      </Panels>
    </div>
  );
}
