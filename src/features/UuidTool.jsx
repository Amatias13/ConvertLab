import { useState, useEffect } from "react";
import { ToolHeader, Panels, Panel0, PanelLabel, OptionsBar, OptLabel, OptGroup, OptBtn, Btn } from "../components/UI";
import { useClipboard } from "../hooks/useClipboard";

function genUUID4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = crypto.getRandomValues(new Uint8Array(1))[0] & 15;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}
function genNanoID() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";
  return Array.from(crypto.getRandomValues(new Uint8Array(21)))
    .map((b) => chars[b % 64])
    .join("");
}
function genToken(bytes) {
  return Array.from(crypto.getRandomValues(new Uint8Array(bytes / 2)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function UuidTool() {
  const { copy } = useClipboard();
  const [count, setCount] = useState(1);
  const [format, setFormat] = useState("uuid4");
  const [upper, setUpper] = useState(false);
  const [output, setOutput] = useState("");

  const generate = () => {
    const ids = Array.from({ length: count }, () => {
      if (format === "uuid4") return genUUID4();
      if (format === "nanoid") return genNanoID();
      if (format === "token32") return genToken(32);
      return genToken(64);
    }).map((id) => (upper ? id.toUpperCase() : id.toLowerCase()));
    setOutput(ids.join("\n"));
  };

  useEffect(() => {
    generate();
  }, [count, format, upper]);

  return (
    <div className="tool-wrap">
      <ToolHeader title="UUID Generator" desc="Generate v4 UUIDs, NanoIDs, and random tokens">
        <Btn
          onClick={() => {
            copy(output, "Copied");
          }}
        >
          Copy all
        </Btn>
        <Btn onClick={generate} primary>
          Regenerate
        </Btn>
      </ToolHeader>

      <OptionsBar>
        <OptLabel>Count:</OptLabel>
        <OptGroup>
          {[1, 5, 10, 25].map((n) => (
            <OptBtn key={n} active={count === n} onClick={() => setCount(n)}>
              {n}
            </OptBtn>
          ))}
        </OptGroup>
        <OptLabel style={{ marginLeft: "0.75rem" }}>Format:</OptLabel>
        <OptGroup>
          {[
            ["uuid4", "UUID v4"],
            ["nanoid", "NanoID"],
            ["token32", "Token 32"],
            ["token64", "Token 64"],
          ].map(([v, l]) => (
            <OptBtn key={v} active={format === v} onClick={() => setFormat(v)}>
              {l}
            </OptBtn>
          ))}
        </OptGroup>
        <OptLabel style={{ marginLeft: "0.75rem" }}>Case:</OptLabel>
        <OptGroup>
          <OptBtn active={!upper} onClick={() => setUpper(false)}>
            lower
          </OptBtn>
          <OptBtn active={upper} onClick={() => setUpper(true)}>
            UPPER
          </OptBtn>
        </OptGroup>
      </OptionsBar>

      <Panels>
        <Panel0>
          <PanelLabel right={`${count} generated`}>Output — click to copy individual</PanelLabel>
          <div style={{ flex: 1, overflow: "auto", padding: "0.85rem", display: "flex", flexDirection: "column", gap: 4 }}>
            {output.split("\n").map((id, i) => (
              <div
                key={i}
                onClick={() => {
                  copy(id, "Copied");
                }}
                style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--text)", padding: "0.4rem 0.75rem", borderRadius: 6, background: "var(--bg2)", border: "1px solid var(--border)", cursor: "pointer", transition: "border-color 0.12s" }}
              >
                {id}
              </div>
            ))}
          </div>
        </Panel0>
      </Panels>
    </div>
  );
}
