import React from "react";
import Hero from "../Hero";
import Goals from "../Goals";
import Tech from "../Tech";
import Roadmap from "../Roadmap";
import Me from "../Me";
import "./styles.css";

/**
 * Global component that renders the entire content of the About Modal, including the Hero, Goals, Tech, Roadmap, and Me sections.
 * This component serves as the main container for all the sections of the About Modal, ensuring a cohesive and organized layout.
 */
function Global() {
  return (
    <div className="global">
      <Hero />
      <Goals />
      <Tech />
      <Roadmap />
      <Me />
    </div>
  );
}

export default Global;
