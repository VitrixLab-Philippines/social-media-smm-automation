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
import CommandCenter from "@/components/dashboard/CommandCenter";
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
  inbox: { eyebrow: "Engagement", title: "Unified inbox", description: "Normalize conversations from connected networks into one assignment and response workflow." },
  calendar: { eyebrow: "Scheduling", title: "Content calendar", description: "Coordinate approved content, platform windows, retries, and publishing status." },
  pipeline: { eyebrow: "CRM", title: "Pipeline and opportunities", description: "Manage leads, stages, activities, and opportunities within the current workspace." },
  accounts: { eyebrow: "Integrations", title: "Social accounts", description: "Connect providers, inspect scopes, token health, capabilities, and re-authentication state." },
  automation: { eyebrow: "Automation", title: "Jobs and workflows", description: "Monitor queues, retries, dead-letter jobs, and workflow execution." },
  audit: { eyebrow: "Security", title: "Audit log", description: "Review workspace-scoped security and business events without exposing secrets." },
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
              <CommandCenter onNavigate={setCurrentSection} />
              <AutomationStatusCard />
              <ApprovalQueue selectedPlatform={selectedPlatform} />
            </div>
          )}

          {(currentSection === "approval" || currentSection === "drafts") && (
            <ApprovalQueue selectedPlatform={selectedPlatform} />
          )}

          {currentSection === "analytics" && <AnalyticsCards />}

          {currentSection === "guardrails" && <BrandProfileCard />}

          {currentSection === "graph" && <GraphExplorer />}\n\n          {["inbox","calendar","pipeline","accounts","automation","audit"].includes(currentSection) && (\n            <section className="card" aria-labelledby="planned-surface" style={{ padding: "1.25rem" }}>\n              <h2 id="planned-surface" style={{ margin: 0, fontSize: "var(--text-lg)" }}>{sectionMeta[currentSection].title}</h2>\n              <p style={{ color: "var(--muted)", lineHeight: "var(--lh-relaxed)" }}>This surface is now part of the application information architecture and server contract. Its records are workspace-scoped; provider actions remain behind authenticated API services, queues, and audit events.</p>\n              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "0.65rem" }}>\n                <div className="card" style={{ padding: "0.8rem" }}>Loading state</div><div className="card" style={{ padding: "0.8rem" }}>Empty state</div><div className="card" style={{ padding: "0.8rem" }}>Error/retry state</div>\n              </div>\n            </section>\n          )}

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
