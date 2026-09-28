"use client";

import React, { useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import DashboardHeader from "@/components/layout/DashboardHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import ApprovalQueue from "@/components/crm/ApprovalQueue";
import AutomationStatusCard from "@/components/crm/AutomationStatusCard";
import AnalyticsCards from "@/components/crm/AnalyticsCards";
import BrandProfileCard from "@/components/crm/BrandProfileCard";
import GraphExplorer from "@/components/dashboard/GraphExplorer";
import { DashboardViewSection } from "@/lib/crm";

const sectionMeta: Record<DashboardViewSection, { eyebrow: string; title: string; description: string }> = {
  overview: { eyebrow: "Command Center", title: "Control your publishing pipeline", description: "Review what needs attention, verify automation health, and keep human approval at the center of publishing." },
  approval: { eyebrow: "Human Approval", title: "Review content before it ships", description: "Approve, reject, or return drafts without leaving the publishing workflow." },
  drafts: { eyebrow: "Content Workspace", title: "Draft library", description: "Browse and filter content across the connected publishing pipeline." },
  analytics: { eyebrow: "Performance", title: "Analytics feedback loop", description: "Use workspace-level publishing signals to understand what has been produced and published." },
  guardrails: { eyebrow: "Brand & Safety", title: "Guardrails and brand policy", description: "Keep voice, audience, prohibited topics, and disclosures aligned with your operating policy." },
  clients: { eyebrow: "Workspace", title: "Client operations", description: "Keep client-facing work separated from internal system diagnostics." },
  settings: { eyebrow: "Configuration", title: "Workspace settings", description: "Production controls belong here rather than inside individual content cards." },
  graph: { eyebrow: "Developer Diagnostics", title: "Architecture graph", description: "Inspect system integration signals without mixing developer diagnostics into daily editorial work." },
};

function SectionIntro({ section }: { section: DashboardViewSection }) {
  const meta = sectionMeta[section];
  return (
    <header style={{ marginBottom: "1.5rem" }}>
      <span className="eyebrow">{meta.eyebrow}</span>
      <h1 style={{ margin: 0, fontSize: "clamp(1.75rem, 3vw, 2.5rem)", lineHeight: 1.15, letterSpacing: "var(--ls-snug)", fontWeight: "var(--weight-black)", color: "var(--text)" }}>
        {meta.title}
      </h1>
      <p style={{ maxWidth: 720, margin: "0.65rem 0 0", color: "var(--muted)", fontSize: "var(--text-sm)", lineHeight: "var(--lh-relaxed)" }}>
        {meta.description}
      </p>
    </header>
  );
}

export default function DashboardPage() {
  const [currentSection, setCurrentSection] = useState<DashboardViewSection>("overview");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      <a className="skip-link" href="#dashboard-main">Skip to dashboard content</a>
      <DashboardHeader
        currentSection={currentSection}
        selectedPlatform={selectedPlatform}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((open) => !open)}
        onPlatformChange={setSelectedPlatform}
      />

      <DashboardShell
        sidebarOpen={sidebarOpen}
        activeSection={currentSection}
        onSelectSection={setCurrentSection}
      >
        <div id="dashboard-main" tabIndex={-1} style={{ maxWidth: 1180, margin: "0 auto" }}>
          <SectionIntro section={currentSection} />

          {currentSection === "overview" && (
            <div style={{ display: "grid", gap: "1.5rem" }}>
              <AutomationStatusCard />
              <ApprovalQueue selectedPlatform={selectedPlatform} />
            </div>
          )}

          {(currentSection === "approval" || currentSection === "drafts") && (
            <ApprovalQueue selectedPlatform={selectedPlatform} />
          )}

          {currentSection === "analytics" && <AnalyticsCards />}

          {currentSection === "guardrails" && <BrandProfileCard />}

          {currentSection === "graph" && <GraphExplorer />}

          {currentSection === "clients" && (
            <section className="card" aria-labelledby="clients-heading">
              <h2 id="clients-heading" style={{ margin: 0, fontSize: "var(--text-lg)" }}>Client workspace</h2>
              <p style={{ margin: "0.5rem 0 0", color: "var(--muted)", fontSize: "var(--text-sm)" }}>
                Client management is isolated here so the editorial dashboard stays focused on content operations.
              </p>
            </section>
          )}

          {currentSection === "settings" && (
            <div style={{ display: "grid", gap: "1.5rem" }}>
              <AutomationStatusCard />
              <section className="card" aria-labelledby="settings-note">
                <h2 id="settings-note" style={{ margin: 0, fontSize: "var(--text-lg)" }}>Workspace configuration</h2>
                <p style={{ margin: "0.5rem 0 0", color: "var(--muted)", fontSize: "var(--text-sm)" }}>
                  Configuration surfaces should remain server-authoritative. This view intentionally exposes status and policy context without pretending browser-local toggles are persisted.
                </p>
              </section>
            </div>
          )}
        </div>
      </DashboardShell>
      <SiteFooter />
    </>
  );
}
