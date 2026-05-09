import React from "react";
import "./styles.css";
import { icons, goals } from "../../../../data/about";
import Icon from "../../../Icon";

/**
 * The Goals component is a part of the About modal's "Global" section, responsible for displaying the project's main goals. It renders a grid of goal items, each consisting of an icon, a title, and a description. The data for the goals is imported from the `about` data file, where each goal is represented as an array containing an icon key, a title, and a description. The component uses the Icon component to render the corresponding icon for each goal based on the provided icon key. The styling is handled inline for simplicity, with a focus on creating a clean and organized layout for presenting the project's objectives to users.
 * The component is structured as follows:
 */
function Goals() {
  return (
    <div>
      <h3 className="goals-title">🎯 Goals</h3>
      <div className="goals-grid">
        {goals.map(([iconKey, title, desc]) => (
          <div key={title} className="goals-item">
            <div className="goals-item-title">
              <Icon icon={icons[iconKey]} />
              {title}
            </div>
            <div className="goals-item-description">{desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Goals;
