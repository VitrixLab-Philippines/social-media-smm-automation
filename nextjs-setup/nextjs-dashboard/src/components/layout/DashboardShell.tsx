"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import SiteFooter from "@/components/layout/SiteFooter";

import { DashboardViewSection } from "@/lib/crm";

interface DashboardShellProps {
  children: ReactNode;
  sidebarOpen: boolean;
  activeSection: DashboardViewSection;
  onSelectSection: (section: DashboardViewSection) => void;
}

export default function DashboardShell({
  children,
  sidebarOpen,
  activeSection,
  onSelectSection,
}: DashboardShellProps) {
  const navItems = [
    { id: "approval" as const, label: "Approval Gate", icon: "✓", badge: "Live" },
    { id: "graph" as const, label: "Architecture Graph", icon: "⎇", badge: "AST" },
    { id: "analytics" as const, label: "Analytics Loop", icon: "📈", badge: "6 Nets" },
    { id: "guardrails" as const, label: "Brand Guardrails", icon: "🛡", badge: "Rules" },
    { id: "crm" as const, label: "CRM", icon: "📊", badge: "Live" },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <div style={{ display: "flex", flex: 1, paddingTop: "64px" }}>
        {/* Controllable Sidebar */}
        {sidebarOpen && (
          <aside
            style={{
              width: "260px",
              flexShrink: 0,
              background: "var(--panel)",
              borderRight: "1px solid var(--line)",
              padding: "1.5rem 1rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            {/* Sidebar Brand Mini */}
            <div>
              <div style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-bold)", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "var(--ls-label)", marginBottom: "0.5rem" }}>
                Workspace
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "var(--radius-small)", background: "var(--primary-light)", color: "var(--primary)", display: "grid", placeContent: "center", fontWeight: "var(--weight-black)", fontSize: "0.75rem" }}>
                  AI
                </div>
                <div>
                  <div style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-bold)", color: "var(--text)" }}>
                    SMM Control Hub
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>Enterprise Agency</div>
                </div>
              </div>
            </div>

            {/* Nav list */}
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              <div style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-bold)", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "var(--ls-label)", marginBottom: "0.25rem" }}>
                Navigation
              </div>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSelectSection(item.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.55rem 0.75rem",
                    borderRadius: "var(--radius-small)",
                    background: activeSection === item.id ? "var(--primary-light)" : "transparent",
                    color: activeSection === item.id ? "var(--primary)" : "var(--text)",
                    border: "none",
                    textAlign: "left",
                    cursor: "pointer",
                    fontSize: "var(--text-xs)",
                    fontWeight: "var(--weight-semibold)",
                    transition: "background 0.15s ease",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </span>
                  <span
                    style={{
                      fontSize: "0.65rem",
                      color: activeSection === item.id ? "var(--primary)" : "var(--muted)",
                      background: "var(--surface)",
                      padding: "0.1rem 0.4rem",
                      borderRadius: "var(--radius-small)",
                      border: "1px solid var(--line)",
                    }}
                  >
                    {item.badge}
                  </span>
                </button>
              ))}
            </nav>

            {/* Quick Links */}
            <div style={{ marginTop: "auto", borderTop: "1px solid var(--line)", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--muted)", fontWeight: "var(--weight-bold)", textTransform: "uppercase" }}>
                Quick Links
              </div>
              <Link href="/" style={{ fontSize: "var(--text-xs)", color: "var(--muted)", textDecoration: "none" }}>
                ← Return to Landing Page
              </Link>
              <Link href="/login" style={{ fontSize: "var(--text-xs)", color: "var(--muted)", textDecoration: "none" }}>
                Sign In / Out
              </Link>
            </div>
          </aside>
        )}

        {/* Main Content Area */}
        <main style={{ flex: 1, minWidth: 0, padding: "1.5rem 2rem 3rem" }}>
          {children}
        </main>
      </div>

      <SiteFooter />
    </div>
  );
}
