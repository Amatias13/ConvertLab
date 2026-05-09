

import './styles.css'

/**
 * External Link Component
 * Renders an anchor tag that opens the link in a new tab with appropriate styling and security attributes.
 * Props:
 * - href: The URL to link to.
 * - children: The content to display inside the link.
 */
function ExtLink({ href, children }) {
  return <a href={href} target="_blank" rel="noreferrer" className="ext-link">{children} ↗</a>
}

export default ExtLink