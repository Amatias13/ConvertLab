import { Component } from "react";

/**
 * Top-level error boundary — catches render errors in any tool
 * and shows a recovery UI instead of a blank white screen.
 *
 * Usage: wrap <App /> or individual tool panels in <ErrorBoundary>.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // In production you could send this to a monitoring service
    if (import.meta.env.DEV) {
      console.error("[ErrorBoundary]", error, info.componentStack);
    }
  }

  reset = () => this.setState({ error: null });

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          height: "100%",
          padding: "2rem",
          textAlign: "center",
          color: "var(--text2)",
          fontFamily: "var(--sans)",
        }}
      >
        <span style={{ fontSize: 36 }}>⚠️</span>
        <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", margin: 0 }}>
          Something went wrong in this tool
        </p>
        <p
          style={{
            fontFamily: "var(--mono)",
            fontSize: 12,
            background: "var(--bg3)",
            borderRadius: 6,
            padding: "0.5rem 0.75rem",
            maxWidth: 480,
            wordBreak: "break-word",
            color: "var(--accent2)",
            margin: 0,
          }}
        >
          {this.state.error.message}
        </p>
        <button
          onClick={this.reset}
          style={{
            padding: "0.4rem 1rem",
            borderRadius: 6,
            border: "1px solid var(--border2)",
            background: "var(--bg3)",
            color: "var(--text)",
            fontSize: 13,
            cursor: "pointer",
            fontFamily: "var(--sans)",
          }}
        >
          Try again
        </button>
      </div>
    );
  }
}
