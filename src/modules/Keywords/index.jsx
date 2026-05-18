import React from "react";
import "./styles.css";

/**
 * Displays a list of keywords as hashtags. Expects an array of strings as the `keywords` prop.
 * Example usage:
 * <Keywords keywords={['AI', 'Productivity', 'Writing']} />
 * This would render:
 * #AI #Productivity #Writing
 */
function Keywords({ keywords }) {
  if (!keywords || keywords.length === 0) return null;

  return (
    <div className="keywordsContainer">
      {keywords.map((k) => (
        <span key={k} className="keyword">
          #{k}
        </span>
      ))}
    </div>
  );
}

export default Keywords;
