import React from 'react'
import './styles.css'

/**
 * A simple tab component used in the About modal to switch between the "Project" overview and individual tool details.
 * It accepts three props:
 * - `active`: A boolean indicating whether this tab is currently active.
 * - `onClick`: A function to call when the tab is clicked, typically used to change the active tab in the parent component.
 * - `children`: The content to display inside the tab, usually the tab label.
 * The styling is handled via CSS classes, with an additional 'active' class applied when the tab is active.
 */
function Tab({ active, onClick, children }) {
  return (
    <button onClick={onClick} className={`tab-button ${active ? 'active' : ''}`}>
      {children}
    </button>
  )
}

export default Tab
