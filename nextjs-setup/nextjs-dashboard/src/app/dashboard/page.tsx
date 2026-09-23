"use client";

import { useState, useEffect } from "react";

export default function DashboardPage() {
  const [phases, setPhases] = useState<Record<string, { nodes: string[]; edgeCount: number }>>({});
  const [planProgress, setPlanProgress] = useState<Record<string, { completed: number; total: number }>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/graph")
      .then((res) => {
        if (!res.ok) throw new Error("Graph data not available");
        return res.json();
      })
      .then((data) => {
        setPhases(data.phases || {});
        setPlanProgress(data.planProgress || {});
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading graph data...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-canvas flex">
      <main className="p-8">
        <h1 className="text-4xl font-bold text-primary">Dashboard</h1>
        <p className="text-secondary">SMM Automation Dashboard</p>

        {/* Phases Summary */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
          {Object.entries(planProgress).map(([phase, progress]) => (
            <div key={phase} className="bg-panel border rounded-lg p-4">
              <h3 className="text-sm font-medium text-muted mb-2">{phase}</h3>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-medium">{progress.completed}</span> / {progress.total} nodes connected
                </p>
                <div className="bg-surface rounded h-2">
                  <div
                    className="bg-primary h-2 rounded w-{{ Math.min(100, (progress.completed / progress.total) * 100 ) }}%"
                    style={{ width: `${Math.min(100, (progress.completed / progress.total) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* God Nodes */}
        {planProgress && (
          <div className="mt-6">
            <h2 className="text-xl font-bold text-primary mb-4">God Nodes (Core Abstractions)</h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {/* God nodes will be populated from graph data */}
            </div>
          </div>
        )}

        {/* Connections */}
        {loading || !phases ? null : (
          <div className="mt-6">
            <h2 className="text-xl font-bold text-primary mb-4">Phase Integrations</h2>
            <p className="text-secondary mb-4">
              Cross-phase edges indicate integration points between planning, publishing, analytics, and other SMM components
            </p>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(phases).map(([phase, info]) => (
                <div key={phase} className="bg-panel rounded p-3 text-sm">
                  <div className="font-medium">{phase}</div>
                  <div className="text-muted text-xs">{info.edgeCount} integration edges</div>
                  <div className="mt-1">
                    <span className="text-muted capitalize">{info.nodes.length > 0 ? info.nodes.slice(0, 3).join(", ") : "—"}...</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && <p className="mt-4 text-red-500">Error loading: {error}</p>}
      </main>
    </div>
  );
}