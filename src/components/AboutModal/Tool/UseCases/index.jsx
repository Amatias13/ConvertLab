import React from "react";
import "./styles.css";

/**
 * Component to display the common use cases for a tool in the About Modal.
 *
 * Props:
 * - useCases: An array of strings representing common use cases for the tool.
 * Example usage:
 * <UseCases
 *  useCases={[
 * "Use case 1: Description of the first use case.",
 * "Use case 2: Description of the second use case.",
 * "Use case 3: Description of the third use case."
 *  ]} />
 */
function UseCases({ useCases }) {
  if (!useCases || useCases.length === 0) return null;

  return (
    <div>
      <div className="useCases">Common use cases</div>
      <ul className="useCasesList">
        {useCases.map((u, i) => (
          <li key={i} className="useCasesListItem">
            {u}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UseCases;
