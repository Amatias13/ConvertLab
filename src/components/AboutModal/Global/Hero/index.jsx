import React from "react";
import "./styles.css";
import { tags } from "../../../../data/about";

/**
 * Hero section of the About modal, showcasing the product name, description, and key tags.
 * This is the first thing users see when they open the About modal, so it should be concise and impactful.
 */
function Hero() {
  return (
    <div className="hero">
      <div className="hero-content">
        <span className="hero-pulse" />
        <span className="hero-title">ConvertLab</span>
      </div>
      <p className="hero-description">A free, open-source developer toolkit that runs entirely in your browser. No accounts, no uploads, no servers — every transformation happens locally on your device.</p>
      <div className="hero-tags">
        {tags.map((tag) => (
          <span key={tag} className="hero-tag">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export default Hero;
