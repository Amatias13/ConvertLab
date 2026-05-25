import "./styles.css";

/**
 * Keyboard key display component.
 * Used in ShortcutsModal and any help/hint text.
 */
export default function Kbd({ children }) {
  return <kbd className="kbd">{children}</kbd>;
}
