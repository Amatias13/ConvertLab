import React from "react";
import "./styles.css";
import { techStack } from "../../data/about";

/**
 * The Tech component is a part of the About modal's "Global" section, responsible for showcasing the technologies used in the project. It renders a list of technology items, each displayed as a badge with the technology's name and color. The data for the technologies is imported from the `about` data file, where each technology is represented as an object containing its name and associated color. The component uses inline styling to create visually distinct badges for each technology, providing users with a quick overview of the tools and frameworks utilized in the development of the project. The Tech component is structured to be simple and visually appealing, making it easy for users to identify the technologies that power the project at a glance.
 */
function Tech() {
  return (
    <div>
      <h3 className="tech-title">⚙️ Technologies</h3>
      <div className="tech-list">
        {techStack.map((t) => (
          <div key={t.name} style={{ color: t.color }} className="tech-badge">
            {t.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tech;
