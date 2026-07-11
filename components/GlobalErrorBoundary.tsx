"use client";

import React from "react";

interface State { hasError: boolean; message: string }

export class GlobalErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error?.message || "Unknown error" };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[GlobalErrorBoundary] Caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#FDFCF8", padding: "2rem", fontFamily: "sans-serif" }}>
          <div style={{ maxWidth: 420, textAlign: "center" }}>
            <div style={{ width: 64, height: 64, background: "#FEE2E2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#DC2626" strokeWidth={2}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1B1716", marginBottom: "0.75rem" }}>
              Something went wrong
            </h1>
            <p style={{ color: "#6B7280", marginBottom: "2rem", lineHeight: 1.6 }}>
              An unexpected error occurred. Please refresh the page to continue.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{ background: "#630102", color: "white", border: "none", borderRadius: "0.75rem", padding: "0.875rem 2rem", fontWeight: 700, fontSize: "0.9375rem", cursor: "pointer", width: "100%" }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
