"use client";

import Link from "next/link";
import { useState } from "react";

/** DashboardHeader — top app bar for Dashboard page.
 *  Distinct from Landing Page's SiteNav: compact, section-aware,
 *  shows active view mode and platform filter, no theme toggle.
 */
export default function DashboardHeader({
  currentSection,
  viewMode,
  density,
  selectedPlatform,
  sidebarOpen,
  onSelectSection,
  onToggleViewMode,
  onToggleDensity,
  onPlatformChange,
}: {
  currentSection: string;
  viewMode: "grid" | "list";
  density: "spacious" | "compact";
  selectedPlatform: string;
  sidebarOpen: boolean;
  onSelectSection: (section: string) => void;
  onToggleViewMode: (mode: "grid" | "list") => void;
  onToggleDensity: (density: "spacious" | "compact") => void;
  onPlatformChange: (platform: string) => void;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem 1.5rem",
        background: "var(--panel)",
        borderBottom: "1px solid var(--line)",
        margin: "-1.5rem -1.5rem 1.5rem",
        color: "var(--text)",
      }}
      aria-label="Dashboard navigation"
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "var(--radius-small)",
            background: "var(--primary-light)",
            color: "var(--primary)",
            display: "grid",
            placeContent: "center",
            fontWeight: "var(--weight-black)",
            fontSize: "1rem",
          }}
        >
          AI
        </div>
        <Link
          href="#"
          style={{
            fontSize: "var(--text-sm)",
            fontWeight: "var(--weight-semibold)",
            color: "var(--text)",
            textDecoration: "none",
          }}
        >
          SMM Control Hub
        </Link>
      </div>

      <nav style={{ display: "flex", gap: "1rem" }}>
        <button
          onClick={() => setIsMenuOpen(true)}
          aria-label="Open navigation menu"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "transparent",
            border: "none",
            color: "var(--muted)",
            fontSize: "var(--text-xs)",
            cursor: "pointer",
          }}
        >
          <span>{sidebarOpen ? "☰" : "✕"}</span>
          Navigation
        </button>
      </nav>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <button
          onClick={onToggleViewMode}
          style={{
            padding: "0.25rem 0.5rem",
            background: viewMode === "grid" ? "var(--primary-light)" : "transparent",
            borderRadius: "var(--radius-small)",
            border: "1px solid var(--line)",
            color: viewMode === "grid" ? "var(--primary)" : "var(--muted)",
            fontSize: "var(--text-xs)",
            cursor: "pointer",
          }}
        >
          {viewMode}
        </button>
        <button
          onClick={onToggleDensity}
          style={{
            padding: "0.25rem 0.5rem",
            background: density === "spacious" ? "var(--primary-light)" : "transparent",
            borderRadius: "var(--radius-small)",
            border: "1px solid var(--line)",
            color: density === "spacious" ? "var(--primary)" : "var(--muted)",
            fontSize: "var(--text-xs)",
            cursor: "pointer",
          }}
        >
          {density}
        </button>
        <Link
          href="#"
          style={{
            padding: "0.25rem 0.5rem",
            background: "var(--surface)",
            borderRadius: "var(--radius-small)",
            border: "1px solid var(--line)",
            color: "var(--muted)",
            fontSize: "var(--text-xs)",
            textDecoration: "none",
          }}
        >
          {selectedPlatform}
        </Link>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <nav
          style={{
            position: "fixed",
            top: "64px",
            right: 0,
            width: "200px",
            maxHeight: "calc(100vh - 64px)",
            background: "var(--panel)",
            borderLeft: "1px solid var(--line)",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            zIndex: 100,
          }}
        >
          <button
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close navigation menu"
            style={{
              alignSelf: "flex-start",
              padding: "0.25rem",
              background: "transparent",
              border: "none",
              color: "var(--muted)",
              fontSize: "1.5rem",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--muted)", textTransform: "uppercase", marginBottom: "0.5rem" }}>
            Navigation
          </div>
          <Link
            href="#"
            style={{
              display: "block",
              padding: "0.5rem",
              color: "var(--text)",
              textDecoration: "none",
              borderBottom: "1px solid var(--line)",
            }}
            onClick={() => onSelectSection("approval")}
          >
            Approval Gate
          </Link>
          <Link
            href="#"
            style={{
              display: "block",
              padding: "0.5rem",
              color: "var(--text)",
              textDecoration: "none",
              borderBottom: "1px solid var(--line)",
            }}
            onClick={() => onSelectSection("graph")}
          >
            Architecture Graph
          </Link>
          <Link
            href="#"
            style={{
              display: "block",
              padding: "0.5rem",
              color: "var(--text)",
              textDecoration: "none",
              borderBottom: "1px solid var(--line)",
            }}
            onClick={() => onSelectSection("analytics")}
          >
            Analytics Loop
          </Link>
          <Link
            href="#"
            style={{
              display: "block",
              padding: "0.5rem",
              color: "var(--text)",
              textDecoration: "none",
              borderBottom: "1px solid var(--line)",
            }}
            onClick={() => onSelectSection("guardrails")}
          >
            Brand Guardrails
          </Link>
        </nav>
      )}
    </header>
  );
}