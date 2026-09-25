"use client";

import React from "react";
import { ContentDraft, DraftStatus } from "@/lib/crm";
import AnalyticsCards from "./AnalyticsCards";
import BrandProfileCard from "./BrandProfileCard";
import ContentDraftCard from "./ContentDraftCard";
import ApprovalQueue from "./ApprovalQueue";
import AutomationStatusCard from "./AutomationStatusCard";

/** CRMDashboard — CRM feature overview panel.
 *  Displays key CRM metrics, drafts, brand profile, and approval gate
 *  in a unified dashboard layout distinct from the landing page.
 */
export default function CRMDashboard() {
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [density, setDensity] = React.useState<"spacious" | "compact">("spacious");
  const [selectedPlatform, setSelectedPlatform] = React.useState<string>("all");

  return (
    <div style={{
      padding: "1.5rem",
      gap: "1.5rem",
      background: "var(--panel)",
      borderRadius: "var(--radius-medium)",
    }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
        <AutomationStatusCard />
        <ApprovalQueue viewMode={viewMode} density={density} selectedPlatform={selectedPlatform} />
        <AnalyticsCards />
        <BrandProfileCard />
        <ContentDraftCard />
      </div>
    </div>
  );
}