import React from "react";
import { personal } from "../../../../data/about";
import "./styles.css";
import ExtLink from "../../../ExtLink";

/**
 * The Me component is a part of the About modal's "Global" section, designed to provide users with information about the creator of the project. It displays a personal avatar, name, role, location, and a brief description of the creator's background and interests. Additionally, it includes links to the creator's GitHub, LinkedIn, portfolio, and project repository, allowing users to easily connect and explore more of their work. The component also features a "Buy me a coffee" link that triggers a custom event when clicked, providing an opportunity for users to support the creator. The Me component is structured to be visually appealing and informative, giving users insight into the person behind the project while encouraging engagement through external links.
 */
function Me() {
  return (
    <div className="me">
      <div className="me-avatar">
        <img src="src/assets/me.jpeg" alt={personal.name} className="me-avatar-img" />
      </div>
      <div style={{ flex: 1 }}>
        <div className="me-name">{personal.name}</div>
        <div className="me-role-location">
          {personal.role} · {personal.location}
        </div>
        <div className="me-description"> {personal.description}</div>
        <div className="me-links">
          {personal.links.map((link) => (
            <ExtLink key={link.url} href={link.url}>
              {link.label}
            </ExtLink>
          ))}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              document.dispatchEvent(new CustomEvent("open-coffee"));
            }}
            className="me-coffee-link"
          >
            ☕ Buy me a coffee
          </a>
        </div>
      </div>
    </div>
  );
}

export default Me;
