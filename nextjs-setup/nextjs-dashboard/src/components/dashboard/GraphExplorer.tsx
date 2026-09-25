"use client";

import React, { useState, useEffect } from "react";

interface PhaseInfo {
  nodes: string[];
  edgeCount: number;
}

interface PhaseProgress {
  completed: number;
  total: number;
}

interface GraphData {
  phases: Record<string, PhaseInfo>;
  planProgress: Record<string, PhaseProgress>;
  totalNodes: number;
  totalLinks: number;
  totalHyperedges: number;
  extractionTime: string;
}

export default function GraphExplorer() {
  const [data, setData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/graph")
      .then((res) => {
        if (!res.ok) throw new Error("Graph data not available");
        return res.json() as Promise<GraphData>;
      })
      .then((d) => {
        setData(d);
        setError(null);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p style={{ color: "var(--muted)", fontSize: "var(--text-sm)" }}>Loading graph data…</p>;
  }

  if (error) {
    return (
      <div
        role="alert"
        style={{
          padding: "1rem",
          borderLeft: "3px solid #f43f5e",
          background: "rgba(244,63,94,0.08)",
          borderRadius: "var(--radius-small)",
          color: "var(--text)",
        }}
      >
        <strong>Error:</strong> {error}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div>
      <div style={{ marginBottom: "1.25rem" }}>
        <span className="eyebrow">Backend Architecture Health</span>
        <h2 style={{ fontSize: "var(--text-xl)", fontWeight: "var(--weight-black)", color: "var(--text)", margin: 0 }}>
          Codebase Integration & Dependency Graph
        </h2>
        <p style={{ color: "var(--muted)", margin: "0.25rem 0 0", fontSize: "var(--text-sm)" }}>
          Static AST analysis mapping the Python pipeline boundaries, adapters, WASM modules, and moderation ports.
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.75rem", flexWrap: "wrap" }}>
        {[
          { label: "Total AST Nodes", value: data.totalNodes },
          { label: "Integration Links", value: data.totalLinks },
          { label: "Identified Phases", value: Object.keys(data.phases).length },
        ].map((stat) => (
          <div key={stat.label} className="card" style={{ padding: "1rem 1.5rem", minWidth: "160px" }}>
            <div style={{ fontSize: "var(--text-2xl)", fontWeight: "var(--weight-black)", color: "var(--primary)", lineHeight: 1 }}>
              {stat.value}
            </div>
            <div
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--muted)",
                marginTop: "0.35rem",
                textTransform: "uppercase",
                letterSpacing: "var(--ls-label)",
                fontWeight: "var(--weight-bold)",
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Phase progress grid */}
      <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
        {Object.entries(data.planProgress).map(([phase, progress]) => {
          const pct = progress.total > 0 ? Math.min(100, (progress.completed / progress.total) * 100) : 0;
          const phaseInfo = data.phases[phase];
          return (
            <div key={phase} className="card" style={{ padding: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.35rem" }}>
                <h3 style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", color: "var(--text)", margin: 0 }}>
                  {phase}
                </h3>
                <span style={{ fontSize: "var(--text-xs)", color: "var(--primary)", fontWeight: "var(--weight-bold)" }}>
                  {Math.round(pct)}%
                </span>
              </div>

              <p style={{ fontSize: "var(--text-xs)", color: "var(--muted)", margin: "0 0 0.75rem" }}>
                {phaseInfo?.edgeCount ?? 0} cross-layer links &middot; {phaseInfo?.nodes.length ?? 0} symbols
              </p>

              {/* Progress bar */}
              <div style={{ background: "var(--surface)", borderRadius: "999px", height: "6px", overflow: "hidden" }}>
                <div
                  style={{
                    width: `${pct}%`,
                    height: "100%",
                    background: "var(--primary)",
                    borderRadius: "999px",
                    transition: "width 0.4s ease",
                  }}
                />
              </div>

              {/* Nodes preview */}
              {phaseInfo && phaseInfo.nodes.length > 0 && (
                <div style={{ marginTop: "0.75rem", fontSize: "0.7rem", color: "var(--muted)", lineHeight: 1.4 }}>
                  {phaseInfo.nodes.slice(0, 3).join(", ")}
                  {phaseInfo.nodes.length > 3 && ` +${phaseInfo.nodes.length - 3} more`}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p style={{ fontSize: "var(--text-xs)", color: "var(--muted)", marginTop: "1.5rem" }}>
        Source: graphify AST engine &middot; Extracted: {new Date(data.extractionTime).toLocaleString()}
      </p>
    </div>
  );
}
