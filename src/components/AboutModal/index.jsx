import { useState } from "react";
import { useApp } from "../../context/AppContext";

// Components
import Tab from "../Tab";
import Global from "./Global";
import Tool from "./Tool";

// Styles
import "./styles.css";

/**
 * AboutModal component displays information about the ConvertLab project and individual tools.
 * It has two tabs: one for general information about ConvertLab and another for details about a specific tool.
 * @param {string} toolId - The unique identifier of the tool to display information for in the "About this tool" tab.
 * @returns {JSX.Element} The rendered AboutModal component.
 */
export function AboutModal({ toolId }) {
  const { modal, setModal } = useApp();
  const [tab, setTab] = useState(toolId ? "tool" : "project");
  if (modal !== "about") return null;

  return (
    <div className="modal-backdrop" onClick={() => setModal(null)}>
      <div className="modal-box about-modal" onClick={(e) => e.stopPropagation()}>
        <div className="about-modal-header">
          <div className="about-modal-tabs">
            <Tab active={tab === "project"} onClick={() => setTab("project")}>
              About ConvertLab
            </Tab>
            {toolId && (
              <Tab active={tab === "tool"} onClick={() => setTab("tool")}>
                About this tool
              </Tab>
            )}
          </div>
          <button onClick={() => setModal(null)} className="about-modal-close">
            ✕
          </button>
        </div>
        <div className="about-modal-content">{tab === "project" ? <Global /> : <Tool toolId={toolId} />}</div>
      </div>
    </div>
  );
}

export default AboutModal;
