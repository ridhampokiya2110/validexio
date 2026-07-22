"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to help diagnose iOS-specific issues
    if (process.env.NODE_ENV === "development") {
      console.error("[app/error.tsx] Page error:", error?.message, error?.digest, error?.stack);
    }
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#FDFCF8",
        padding: "2rem",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div style={{ maxWidth: 420, textAlign: "center" }}>
        <div
          style={{
            width: 64,
            height: 64,
            background: "#FEE2E2",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
          }}
        >
          <svg
            width="28"
            height="28"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#DC2626"
            strokeWidth={2}
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 800,
            color: "#1B1716",
            marginBottom: "0.5rem",
          }}
        >
          Something went wrong
        </h1>

        <p
          style={{
            color: "#6B7280",
            marginBottom: "2rem",
            lineHeight: 1.6,
            fontSize: "0.95rem",
          }}
        >
          An unexpected error occurred while loading the page. Please refresh to try again.
          {error?.digest && (
            <span style={{ display: "block", fontSize: "0.75rem", color: "#9CA3AF", marginTop: "0.5rem" }}>
              Error ID: {error.digest}
            </span>
          )}
        </p>

        {process.env.NODE_ENV === "development" && (
          <div style={{ 
            background: "#f3f4f6", 
            padding: "1rem", 
            borderRadius: "0.5rem", 
            textAlign: "left", 
            marginBottom: "1.5rem",
            overflowX: "auto",
            fontSize: "0.75rem",
            color: "#EF4444"
          }}>
            <strong>Message:</strong> {error?.message || "No error message"}<br/>
            {error?.stack && (
              <div style={{ marginTop: "0.5rem", whiteSpace: "pre-wrap", color: "#6B7280" }}>
                <strong>Stack:</strong><br/>
                {error.stack}
              </div>
            )}
          </div>
        )}

        <button
          onClick={reset}
          style={{
            background: "#630102",
            color: "white",
            border: "none",
            borderRadius: "0.75rem",
            padding: "0.875rem 2rem",
            fontWeight: 700,
            fontSize: "0.9375rem",
            cursor: "pointer",
            width: "100%",
            marginBottom: "0.75rem",
          }}
        >
          Try Again
        </button>

        <button
          onClick={() => (window.location.href = "/")}
          style={{
            background: "transparent",
            color: "#630102",
            border: "1.5px solid #630102",
            borderRadius: "0.75rem",
            padding: "0.875rem 2rem",
            fontWeight: 700,
            fontSize: "0.9375rem",
            cursor: "pointer",
            width: "100%",
          }}
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
