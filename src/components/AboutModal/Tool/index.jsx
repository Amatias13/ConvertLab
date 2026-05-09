import React from "react";

// Components
import Title from "./Title";
import UseCases from "./UseCases";
import Examples from "./Examples";
import Tips from "./Tips";
import Keywords from "./Keywords";

// Styles
import "./styles.css";

// Context
import { useApp } from "../../../context/AppContext";
import { TOOL_META } from "../../../tools/toolMeta";
import { ALL_TOOLS } from "../../../tools/registry";

/**
 * Component to display detailed information about a specific tool in the About Modal.
 * It shows the tool's name, description, use cases, examples, tips, and keywords.
 * @param {string} toolId - The unique identifier of the tool to display information for.
 * @returns {JSX.Element} The rendered component for the tool information.
 */
function Tool({ toolId }) {
  const meta = TOOL_META[toolId];
  const tool = ALL_TOOLS.find((t) => t.id === toolId);
  const { showToast } = useApp();
  if (!meta || !tool) return null;

  return (
    <div className="toolContainer">
      <Title icon={tool.icon} title={meta.title} tagline={meta.tagline} color={tool.color} />
      <p className="toolDescription">{meta.description}</p>
      <UseCases useCases={meta.useCases} />
      <Examples
        examples={meta.examples}
        onCopy={(value) => {
          navigator.clipboard.writeText(value);
          showToast?.("Example input copied to clipboard!");
        }}
      />
      <Tips tips={meta.tips} />
      <Keywords keywords={meta.keywords} />
    </div>
  );
}

export default Tool;
