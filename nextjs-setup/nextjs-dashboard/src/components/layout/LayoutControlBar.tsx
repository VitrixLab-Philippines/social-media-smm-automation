"use client";

import React from "react";

import { DashboardViewSection } from "@/lib/crm";

interface LayoutControlBarProps {
  currentSection: DashboardViewSection;
  onSectionChange: (section: DashboardViewSection) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  density: "spacious" | "compact";
  onDensityChange: (density: "spacious" | "compact") => void;
  selectedPlatform: string;
  onPlatformChange: (platform: string) => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export default function LayoutControlBar({
  currentSection,
  onSectionChange,
  viewMode,
  onViewModeChange,
  density,
  onDensityChange,
  selectedPlatform,
  onPlatformChange,
  sidebarOpen,
  onToggleSidebar,
}: LayoutControlBarProps) {
  return (
    <div
      style={{
        background: "var(--panel)",
        border: "1px solid var(--line)",
        borderRadius: "var(--radius-medium)",
        padding: "0.75rem 1rem",
        marginBottom: "1.5rem",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "0.75rem",
      }}
    >
      {/* Left: Navigation Switcher */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
        <button
          onClick={onToggleSidebar}
          style={{
            background: "var(--surface)",
            border: "1px solid var(--line)",
            color: "var(--text)",
            padding: "0.4rem 0.65rem",
            borderRadius: "var(--radius-small)",
            fontSize: "var(--text-xs)",
            cursor: "pointer",
            fontWeight: "var(--weight-bold)",
          }}
          title="Toggle sidebar drawer"
        >
          {sidebarOpen ? "◧ Hide Sidebar" : "◨ Show Sidebar"}
        </button>

        <div style={{ height: "18px", width: "1px", background: "var(--line)" }} />

        {[
          { id: "approval", label: "Approval Gate" },
          { id: "graph", label: "Architecture Graph" },
          { id: "analytics", label: "Analytics Loop" },
          { id: "guardrails", label: "Brand Guardrails" },
        ].map((sec) => (
          <button
            key={sec.id}
            onClick={() => onSectionChange(sec.id as DashboardViewSection)}
            style={{
              padding: "0.35rem 0.75rem",
              borderRadius: "var(--radius-small)",
              background: currentSection === sec.id ? "var(--primary)" : "transparent",
              color: currentSection === sec.id ? "var(--bg)" : "var(--muted)",
              border: "none",
              fontSize: "var(--text-xs)",
              fontWeight: "var(--weight-bold)",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {sec.label}
          </button>
        ))}
      </div>

      {/* Right: Layout & Display Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
        {/* Platform filter */}
        <select
          value={selectedPlatform}
          onChange={(e) => onPlatformChange(e.target.value)}
          style={{
            padding: "0.35rem 0.65rem",
            borderRadius: "var(--radius-small)",
            background: "var(--surface)",
            border: "1px solid var(--line)",
            color: "var(--text)",
            fontSize: "var(--text-xs)",
            fontWeight: "var(--weight-medium)",
          }}
        >
          <option value="all">All Platforms</option>
          <option value="instagram">Instagram</option>
          <option value="meta">Meta / Facebook</option>
          <option value="linkedin">LinkedIn</option>
          <option value="x">X / Twitter</option>
          <option value="tiktok">TikTok</option>
          <option value="youtube">YouTube</option>
        </select>

        {/* View density toggle */}
        <div style={{ display: "flex", border: "1px solid var(--line)", borderRadius: "var(--radius-small)", overflow: "hidden" }}>
          <button
            onClick={() => onDensityChange("spacious")}
            style={{
              padding: "0.3rem 0.6rem",
              background: density === "spacious" ? "var(--primary-light)" : "var(--surface)",
              color: density === "spacious" ? "var(--primary)" : "var(--muted)",
              border: "none",
              fontSize: "var(--text-xs)",
              cursor: "pointer",
            }}
            title="Spacious padding"
          >
            Spacious
          </button>
          <button
            onClick={() => onDensityChange("compact")}
            style={{
              padding: "0.3rem 0.6rem",
              background: density === "compact" ? "var(--primary-light)" : "var(--surface)",
              color: density === "compact" ? "var(--primary)" : "var(--muted)",
              border: "none",
              fontSize: "var(--text-xs)",
              cursor: "pointer",
            }}
            title="Compact density"
          >
            Compact
          </button>
        </div>

        {/* View Mode toggle (Grid vs List) */}
        <div style={{ display: "flex", border: "1px solid var(--line)", borderRadius: "var(--radius-small)", overflow: "hidden" }}>
          <button
            onClick={() => onViewModeChange("grid")}
            style={{
              padding: "0.3rem 0.6rem",
              background: viewMode === "grid" ? "var(--primary-light)" : "var(--surface)",
              color: viewMode === "grid" ? "var(--primary)" : "var(--muted)",
              border: "none",
              fontSize: "var(--text-xs)",
              cursor: "pointer",
            }}
            title="Card Grid layout"
          >
            Grid
          </button>
          <button
            onClick={() => onViewModeChange("list")}
            style={{
              padding: "0.3rem 0.6rem",
              background: viewMode === "list" ? "var(--primary-light)" : "var(--surface)",
              color: viewMode === "list" ? "var(--primary)" : "var(--muted)",
              border: "none",
              fontSize: "var(--text-xs)",
              cursor: "pointer",
            }}
            title="List row layout"
          >
            List
          </button>
        </div>
      </div>
    </div>
  );
}
