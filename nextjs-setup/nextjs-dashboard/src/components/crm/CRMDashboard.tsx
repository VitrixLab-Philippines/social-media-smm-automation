"use client";

import React from "react";
import { ContentDraft, DraftStatus } from "@/lib/crm";
import AnalyticsCards from "./AnalyticsCards";
import BrandProfileCard from "./BrandProfileCard";
import ContentDraftCard from "./ContentDraftCard";
import ApprovalQueue from "./ApprovalQueue";
import AutomationStatusCard from "./AutomationStatusCard";
import StatusPill from "@/components/ui/StatusPill";

/** CRMDashboard — unified CRM feature overview.
 *  Displays all CRM metrics, drafts, brand profile, and approval gate
 *  in a cohesive grid layout with consistent design tokens.
 */
export default function CRMDashboard() {
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [density, setDensity] = React.useState<"spacious" | "compact">("spacious");
  const [selectedPlatform, setSelectedPlatform] = React.useState<string>("all");
  const [draft, setDraft] = React.useState<ContentDraft>({
    id: "draft-001",
    topic: "New Content Draft",
    text: "",
    platform: "linkedin",
    status: "pending",
    hashtags: ["#test"],
    engagementScore: 85,
    author: "Test User",
    createdAt: new Date(),
  });

  const handleUpdateStatus = (id: string, status: DraftStatus) => {
    setDraft((prev) => ({ ...prev, status }));
  };

  return (
    <div
      style={{
        padding: `calc(1.5rem ${density === "spacious" ? "3rem" : "1.5rem"})`,
        gap: "1.5rem",
        background: "var(--panel)",
        borderRadius: "var(--radius-medium)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(auto-fill, minmax(280px, 1fr))`,
          gap: `calc(1rem ${density === "spacious" ? "2rem" : "0.5rem"})`,
        }}
      >
        <AutomationStatusCard />
        <ApprovalQueue viewMode={viewMode} density={density} selectedPlatform={selectedPlatform} />
        <AnalyticsCards />
        <BrandProfileCard />
        <ContentDraftCard
          draft={draft}
          onUpdateStatus={handleUpdateStatus}
        />
      </div>

      {/* Status summary bar */}
      <div
        style={{
          marginTop: "1rem",
          padding: "0.75rem",
          background: "var(--surface)",
          borderRadius: "var(--radius-small)",
          border: "1px solid var(--line)",
        }}
      >
        <StatusPill status="draft" />
        <StatusPill status="approved" />
        <StatusPill status="published" />
      </div>
    </div>
  );
}