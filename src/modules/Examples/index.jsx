import { useClipboard } from "../../hooks/useClipboard";
import "./styles.css";

/**
 * Component to display example inputs for a tool in the About Modal.
 *
 * Props:
 * - examples: An array of objects representing example inputs for the tool, where each object has a 'label' and 'value' property.
 * Example usage:
 * <Examples
 *  examples={[
 * { label: "Example 1", value: "Input for example 1" },
 * { label: "Example 2", value: "Input for example 2" },
 * { label: "Example 3", value: "Input for example 3" }
 *  ]} />
 */
function Examples({ examples }) {
  const { copy } = useClipboard();
  if (!examples || examples.length === 0) return null;

  return (
    <div>
      <div className="examples-try">Try it with</div>
      {examples.map((ex, i) => (
        <div key={i} onClick={() => copy(ex.value, "Example input copied to clipboard!")} className="examplesListItem">
          <div className="examplesListItemLabel">{ex.label}</div>
          <div className="examplesListItemValue">{ex.value}</div>
          <div className="examplesListItemAction">Click to copy →</div>
        </div>
      ))}
    </div>
  );
}

export default Examples;
