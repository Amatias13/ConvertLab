import React from 'react'
import './styles.css'

/**
 * A reusable Icon component that renders an SVG icon based on the provided `icon` prop. The `icon` prop is expected to be an object containing a `path` string that defines the SVG path data and a `color` string that specifies the stroke color of the icon. This component is used throughout the application to display consistent icons with customizable colors.
 * 
 * Example usage:
 * <Icon icon={{ path: "M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z", color: "#4A90E2" }} />
 * In this example, the Icon component will render a house-shaped SVG icon with a stroke color of #4A90E2. 
 * The styling of the SVG is handled via the "icon-svg" CSS class, which can be defined in the accompanying styles.css file to set properties like width, height, and any additional styling needed for the icons in the application.
 * 
 * Props:
 * - `icon`: An object with the following properties:
 *   - `path`: A string containing the SVG path data that defines the shape of the icon.
 *   - `color`: A string representing the stroke color of the icon, typically in hex format (e.g., "#4A90E2").
 *  
 * The component uses the `viewBox` attribute to ensure the SVG scales correctly and applies the stroke color and other styling attributes to render the icon as intended. 
 * This allows for a consistent and flexible way to include icons throughout the application while keeping the implementation simple and maintainable.
 */
function Icon({ icon }) {
  return (
    <svg className="icon-svg" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" stroke={icon.color} >
      <path d={icon.path} />
    </svg>
  )
}

export default Icon