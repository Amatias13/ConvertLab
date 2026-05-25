import { useState, useEffect } from "react";
import { useClipboard } from "../hooks/useClipboard";
import { ToolHeader, Panels, Panel0, Panel, PanelLabel, OptionsBar, OptLabel, OptGroup, OptBtn, Btn, CodeArea, StatusBadge } from "../components/UI";

function jsonToYaml(obj, indent = 0) {
  const pad = "  ".repeat(indent);
  if (obj === null) return "null";
  if (typeof obj === "boolean") return obj.toString();
  if (typeof obj === "number") return obj.toString();
  if (typeof obj === "string") {
    if (/[:#\[\]{},\n&*!|>'"%@`]/.test(obj) || obj === "") return JSON.stringify(obj);
    return obj;
  }
  if (Array.isArray(obj)) {
    if (obj.length === 0) return "[]";
    return obj.map((item) => `${pad}- ${jsonToYaml(item, indent + 1)}`).join("\n");
  }
  if (typeof obj === "object") {
    const entries = Object.entries(obj);
    if (entries.length === 0) return "{}";
    return entries
      .map(([k, v]) => {
        const val = jsonToYaml(v, indent + 1);
        if (typeof v === "object" && v !== null && !Array.isArray(v)) return `${pad}${k}:\n${val}`;
        if (Array.isArray(v) && v.length > 0) return `${pad}${k}:\n${val}`;
        return `${pad}${k}: ${val}`;
      })
      .join("\n");
  }
  return String(obj);
}

function parseYamlValue(v) {
  if (v === "null" || v === "~") return null;
  if (v === "true") return true;
  if (v === "false") return false;
  if (/^-?\d+$/.test(v)) return parseInt(v);
  if (/^-?\d+\.\d+$/.test(v)) return parseFloat(v);
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) return v.slice(1, -1);
  return v;
}

function yamlToJson(yaml) {
  const lines = yaml.split("\n");
  const rootHolder = { __root: null };
  const stack = [{ obj: rootHolder, key: "__root", indent: -1 }];

  for (let line of lines) {
    const trimmed = line.trimStart();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const indent = line.length - trimmed.length;

    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) stack.pop();
    const parentFrame = stack[stack.length - 1];
    const parent = Array.isArray(parentFrame.obj) ? parentFrame.obj : parentFrame.obj[parentFrame.key];

    if (trimmed.startsWith("- ")) {
      if (!Array.isArray(parent)) {
        const arr = [];
        parentFrame.obj[parentFrame.key] = arr;
        stack.push({ obj: arr, key: null, indent: indent - 2 });
      }
      const target = parentFrame.obj[parentFrame.key];
      const rawItem = trimmed.slice(2);
      if (rawItem === "" || rawItem === "|" || rawItem === ">") {
        const newObj = {};
        target.push(newObj);
        stack.push({ obj: target, key: target.length - 1, indent });
      } else {
        target.push(parseYamlValue(rawItem));
      }
    } else if (trimmed.includes(":")) {
      const colonIdx = trimmed.indexOf(":");
      const key = trimmed.slice(0, colonIdx).trim();
      const rawVal = trimmed.slice(colonIdx + 1).trim();

      const container = Array.isArray(parent) ? {} : parent;
      if (Array.isArray(parent)) parent.push(container);

      if (rawVal === "" || rawVal === "|" || rawVal === ">") {
        container[key] = {};
        stack.push({ obj: container, key, indent });
      } else {
        container[key] = parseYamlValue(rawVal);
      }
    }
  }

  return rootHolder.__root;
}

export default function YamlJsonTool() {
  const { copy } = useClipboard();
  const [input, setInput] = useState("");
  const [direction, setDirection] = useState("json2yaml");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!input.trim()) return;
    setError("");
    try {
      if (direction === "json2yaml") {
        const parsed = JSON.parse(input);
        setOutput(jsonToYaml(parsed));
      } else {
        const parsed = yamlToJson(input);
        setOutput(JSON.stringify(parsed, null, 2));
      }
    } catch (e) {
      setError(e.message);
      setOutput("");
    }
  }, [input, direction]);

  return (
    <div className="tool-wrap">
      <ToolHeader title="YAML ↔ JSON Converter" desc="Convert between YAML and JSON formats">
        <Btn
          onClick={() => {
            copy(output, "Copied");
          }}
        >
          Copy
        </Btn>
      </ToolHeader>

      <OptionsBar>
        <OptLabel>Direction:</OptLabel>
        <OptGroup>
          <OptBtn active={direction === "json2yaml"} onClick={() => setDirection("json2yaml")}>
            JSON → YAML
          </OptBtn>
          <OptBtn active={direction === "yaml2json"} onClick={() => setDirection("yaml2json")}>
            YAML → JSON
          </OptBtn>
        </OptGroup>
        <Btn
          style={{ marginLeft: "auto" }}
          onClick={() => {
            setInput(output);
            setOutput("");
            setDirection(direction === "json2yaml" ? "yaml2json" : "json2yaml");
          }}
        >
          ⇄ Swap
        </Btn>
      </OptionsBar>

      <Panels>
        <Panel0>
          <PanelLabel>{direction === "json2yaml" ? "JSON" : "YAML"} Input</PanelLabel>
          <CodeArea value={input} onChange={setInput} placeholder={direction === "json2yaml" ? '{\n  "name": "ConvertLab",\n  "version": 1,\n  "tools": ["json", "yaml"]\n}' : "name: ConvertLab\nversion: 1\ntools:\n  - json\n  - yaml"} />
        </Panel0>
        <Panel>
          <PanelLabel right={error && <StatusBadge type="err">{error}</StatusBadge>}>{direction === "json2yaml" ? "YAML" : "JSON"} Output</PanelLabel>
          <CodeArea value={output} readOnly placeholder="Output will appear here..." />
        </Panel>
      </Panels>
    </div>
  );
}
