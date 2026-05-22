import React from "react";

// Components
import Title from "../Title";
import UseCases from "../UseCases";
import Examples from "../Examples";
import Tips from "../Tips";
import Keywords from "../Keywords";

// Styles
import "./styles.css";

// Context
import { useApp } from "../../context/AppContext";
import { ALL_TOOLS_ENRICHED } from "../../data/tools";

/**
 * Component to display detailed information about a specific tool in the About Modal.
 * It shows the tool's name, description, use cases, examples, tips, and keywords.
 * @param {string} toolId - The unique identifier of the tool to display information for.
 * @returns {JSX.Element} The rendered component for the tool information.
 */
function Tool({ toolId }) {
  const tool = ALL_TOOLS_ENRICHED.find((t) => t.id === toolId);
  const { showToast } = useApp();
  if (!tool?.title) return null;

  return (
    <div className="toolContainer">
      <Title icon={tool.icon} title={tool.title} tagline={tool.tagline} color={tool.color} />
      <p className="toolDescription">{tool.description}</p>
      <UseCases useCases={tool.useCases} />
      <Examples
        examples={tool.examples}
        onCopy={(value) => {
          navigator.clipboard.writeText(value);
          showToast?.("Example input copied to clipboard!");
        }}
      />
      <Tips tips={tool.tips} />
      <Keywords keywords={tool.keywords} />
    </div>
  );
}

export default Tool;
