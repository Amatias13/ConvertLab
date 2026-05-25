import './UI.css'

export function PanelLabel({ children, right }) {
  return (
    <div className="panel-label">
      {children}
      {right && <span className="panel-label-right">{right}</span>}
    </div>
  )
}

export function OptionsBar({ children }) {
  return <div className="opt-bar">{children}</div>
}

export function OptLabel({ children, style }) {
  return <span className="opt-label" style={style}>{children}</span>
}

export function OptGroup({ children, style }) {
  return <div className="opt-group" style={style}>{children}</div>
}

export function OptBtn({ active, onClick, children }) {
  return (
    <button onClick={onClick} className={`opt-btn${active ? ' active' : ''}`}>
      {children}
    </button>
  )
}

export function Btn({ onClick, primary, children, style }) {
  return (
    <button onClick={onClick} className={`btn${primary ? ' primary' : ''}`} style={style}>
      {children}
    </button>
  )
}

export function ToolHeader({ title, desc, children }) {
  return (
    <div className="tool-header">
      <div>
        <div className="tool-header-title">{title}</div>
        {desc && <div className="tool-header-desc">{desc}</div>}
      </div>
      {children && <div className="tool-header-actions">{children}</div>}
    </div>
  )
}

export function Panels({ children }) {
  return <div className="panels">{children}</div>
}

export function Panel({ children, maxWidth, minWidth, style }) {
  return (
    <div className="panel" style={{ maxWidth, minWidth, ...style }}>
      {children}
    </div>
  )
}

export function Panel0({ children, style }) {
  return (
    <div className="panel-0" style={style}>
      {children}
    </div>
  )
}

export function CodeArea({ value, onChange, placeholder, readOnly, mono }) {
  return (
    <textarea
      value={value}
      onChange={onChange ? e => onChange(e.target.value) : undefined}
      placeholder={placeholder}
      readOnly={readOnly}
      className={`code-area${mono === false ? ' sans' : ''}`}
    />
  )
}

export function StatusBadge({ type, children }) {
  return <span className={`status-badge${type ? ' ' + type : ''}`}>{children}</span>
}
