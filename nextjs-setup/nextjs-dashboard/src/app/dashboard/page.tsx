"use client";

import React, { useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import DashboardHeader from "@/components/layout/DashboardHeader";
import LayoutControlBar, { DashboardViewSection } from "@/components/layout/LayoutControlBar";
import SiteFooter from "@/components/layout/SiteFooter";
import ApprovalQueue from "@/components/crm/ApprovalQueue";
import AutomationStatusCard from "@/components/crm/AutomationStatusCard";
import GraphExplorer from "@/components/dashboard/GraphExplorer";
import AnalyticsCards from "@/components/crm/AnalyticsCards";
import BrandProfileCard from "@/components/crm/BrandProfileCard";
import CRMDashboard from "@/components/crm/CRMDashboard";

/**
 * DashboardPage — Controllable CRM and Automation Command Center.
 *
 * Provides:
 * - Dynamic view mode controls (Grid vs List)
 * - Page density controls (Spacious vs Compact)
 * - Controllable drawer sidebar
 * - Platform filter across social networks
 * - Classified components for Approval Gate, Graph, Analytics, and Guardrails
 */
export default function DashboardPage() {
  const [currentSection, setCurrentSection] = useState<DashboardViewSection>("approval");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [density, setDensity] = useState<"spacious" | "compact">("spacious");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <DashboardHeader
        currentSection={currentSection}
        viewMode={viewMode}
        density={density}
        selectedPlatform={selectedPlatform}
        sidebarOpen={sidebarOpen}
        onSelectSection={setCurrentSection}
        onToggleViewMode={setViewMode}
        onToggleDensity={setDensity}
        onPlatformChange={setSelectedPlatform}
      />

      <DashboardShell
        sidebarOpen={sidebarOpen}
        activeSection={currentSection}
        onSelectSection={setCurrentSection}
      >
        {/* Controllable Layout Toolbar */}
        <LayoutControlBar
          currentSection={currentSection}
          onSectionChange={setCurrentSection}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          density={density}
          onDensityChange={setDensity}
          selectedPlatform={selectedPlatform}
          onPlatformChange={setSelectedPlatform}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Active Section Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {currentSection === "approval" && (
            <>
              <AutomationStatusCard />
              <ApprovalQueue
                viewMode={viewMode}
                density={density}
                selectedPlatform={selectedPlatform}
              />
            </>
          )}

          {currentSection === "graph" && <GraphExplorer />}

          {currentSection === "analytics" && <AnalyticsCards />}

          {currentSection === "guardrails" && <BrandProfileCard />}

        {currentSection === "crm" && <CRMDashboard />}
        </div>
      </DashboardShell>

      <SiteFooter />
    </div>
  );
}