import React from "react";
import "./styles.css";
import { roadmap } from "../../data/about";

/**
 * The Roadmap component is a part of the About modal's "Global" section, designed to provide users with a clear overview of the project's development stages and future plans. It renders a list of roadmap items, each representing a specific feature or milestone in the project's lifecycle. Each item is visually distinguished by an icon and color that indicate its status: completed (done), in progress (wip), or planned (plan). The data for the roadmap items is imported from the `about` data file, where each item is represented as an object containing its label and status. The component uses inline styling to create a visually organized and easy-to-understand roadmap, allowing users to quickly grasp the current state of the project and what to expect in the future. The Roadmap component is structured to be simple and informative, making it an effective tool for communicating the project's development trajectory to users.
 */
function Roadmap() {
  return (
    <div>
      <h3 className="roadmap-title">🗺 Roadmap</h3>
      <div className="roadmap-list">
        {roadmap.map((item) => {
          const col = { done: "var(--accent3)", wip: "var(--accent4)", plan: "var(--text3)" }[item.s];
          const lbl = { done: "✓", wip: "⟳", plan: "◦" }[item.s];
          return (
            <div key={item.l} className="roadmap-item">
              <span style={{ color: col }} className="roadmap-item-icon">
                {lbl}
              </span>
              <span style={{ color: item.s === "plan" ? "var(--text3)" : "var(--text2)" }}>{item.l}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Roadmap;
