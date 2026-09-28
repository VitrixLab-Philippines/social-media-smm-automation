"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { DashboardViewSection } from "@/lib/crm";

interface DashboardShellProps {
  children: ReactNode;
  sidebarOpen: boolean;
  activeSection: DashboardViewSection;
  onSelectSection: (section: DashboardViewSection) => void;
}

const primaryNav: Array<{ id: DashboardViewSection; label: string; description: string }> = [
  { id: "overview", label: "Overview", description: "Command center" },
  { id: "approval", label: "Approval gate", description: "Human review" },
  { id: "drafts", label: "Drafts", description: "Content library" },
  { id: "analytics", label: "Analytics", description: "Performance" },
  { id: "guardrails", label: "Brand & guardrails", description: "Policy" },
  { id: "clients", label: "Clients", description: "Client operations" },
  { id: "settings", label: "Settings", description: "Workspace" },
];

export default function DashboardShell({ children, sidebarOpen, activeSection, onSelectSection }: DashboardShellProps) {
  return (
    <div style={{ minHeight: "calc(100vh - 64px)", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        {sidebarOpen && (
          <aside aria-label="Dashboard navigation" style={{ width: 248, flexShrink: 0, borderRight: "1px solid var(--line)", background: "var(--panel)", padding: "1.25rem 0.85rem", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "0.35rem 0.65rem 1rem", borderBottom: "1px solid var(--line)", marginBottom: "0.9rem" }}>
              <span style={{ display: "block", color: "var(--muted)", fontSize: "var(--text-xs)", fontWeight: "var(--weight-bold)", textTransform: "uppercase", letterSpacing: "var(--ls-label)" }}>Workspace</span>
              <strong style={{ display: "block", marginTop: "0.3rem", fontSize: "var(--text-sm)", color: "var(--text)" }}>S M M <span style={{ color: "var(--primary)" }}>AI</span></strong>
            </div>
            <nav style={{ display: "grid", gap: "0.2rem" }}>
              {primaryNav.map((item) => {
                const active = item.id === activeSection;
                return (
                  <button key={item.id} type="button" onClick={() => onSelectSection(item.id)} aria-current={active ? "page" : undefined}
                    style={{ width: "100%", textAlign: "left", border: "1px solid", borderColor: active ? "rgba(5,150,105,0.35)" : "transparent", background: active ? "var(--primary-light)" : "transparent", color: active ? "var(--text)" : "var(--muted)", borderRadius: "var(--radius-medium)", padding: "0.65rem 0.7rem", cursor: "pointer", display: "flex", flexDirection: "column", gap: "0.1rem", fontFamily: "inherit" }}>
                    <span style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)" }}>{item.label}</span>
                    <span style={{ fontSize: "var(--text-xs)", color: active ? "var(--primary)" : "var(--muted)" }}>{item.description}</span>
                  </button>
                );
              })}
            </nav>
            <div style={{ marginTop: "auto", borderTop: "1px solid var(--line)", padding: "1rem 0.65rem 0" }}>
              <Link href="/" style={{ color: "var(--muted)", fontSize: "var(--text-xs)" }}>← Landing page</Link>
              <Link href="/login" style={{ display: "block", marginTop: "0.5rem", color: "var(--muted)", fontSize: "var(--text-xs)" }}>Sign in</Link>
              <button type="button" onClick={() => onSelectSection("graph")} style={{ marginTop: "0.75rem", padding: 0, border: 0, background: "transparent", color: "var(--muted)", font: "inherit", fontSize: "var(--text-xs)", cursor: "pointer" }}>System diagnostics →</button>
            </div>
          </aside>
        )}
        <main style={{ flex: 1, minWidth: 0, padding: "clamp(1.25rem, 3vw, 2.5rem)", overflow: "hidden" }}>{children}</main>
      </div>
    </div>
  );
}
