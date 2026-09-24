"use client";

import React from "react";
import { ContentDraft, DraftStatus } from "@/lib/crm";
import StatusPill from "@/components/ui/StatusPill";

interface ContentDraftCardProps {
  draft: ContentDraft;
  onUpdateStatus: (id: string, status: DraftStatus) => void;
  compact?: boolean;
}

export default function ContentDraftCard({
  draft,
  onUpdateStatus,
  compact = false,
}: ContentDraftCardProps) {
  const platformColors: Record<string, string> = {
    meta: "#1877F2",
    instagram: "#E4405F",
    linkedin: "#0A66C2",
    x: "#718579",
    tiktok: "#00F2FE",
    youtube: "#FF0000",
  };

  return (
    <div
      className="card"
      style={{
        padding: compact ? "1rem" : "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: compact ? "0.65rem" : "1rem",
        borderColor: draft.status === "pending" ? "rgba(245, 158, 11, 0.3)" : undefined,
      }}
    >
      {/* Top Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span
            style={{
              fontSize: "var(--text-xs)",
              fontWeight: "var(--weight-black)",
              textTransform: "uppercase",
              padding: "0.2rem 0.5rem",
              borderRadius: "var(--radius-small)",
              background: "var(--surface)",
              color: platformColors[draft.platform] || "var(--primary)",
              border: "1px solid var(--line)",
            }}
          >
            {draft.platform}
          </span>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--muted)" }}>
            ID: {draft.id}
          </span>
        </div>
        <StatusPill status={draft.status} />
      </div>

      {/* Title / Topic */}
      <h3
        style={{
          fontSize: compact ? "var(--text-sm)" : "var(--text-md)",
          fontWeight: "var(--weight-bold)",
          color: "var(--text)",
          margin: 0,
          lineHeight: "var(--lh-snug)",
        }}
      >
        {draft.topic}
      </h3>

      {/* Post Text */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: "var(--radius-small)",
          padding: compact ? "0.6rem 0.75rem" : "0.85rem 1rem",
          fontSize: compact ? "var(--text-xs)" : "var(--text-sm)",
          color: "var(--text)",
          lineHeight: "var(--lh-normal)",
          whiteSpace: "pre-wrap",
        }}
      >
        {draft.text}
      </div>

      {/* Hashtags & Meta */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
          {draft.hashtags.map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--primary)",
                background: "var(--primary-light)",
                padding: "0.15rem 0.45rem",
                borderRadius: "var(--radius-small)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        {draft.engagementScore && (
          <span style={{ fontSize: "var(--text-xs)", color: "var(--muted)" }}>
            AI Score: <strong style={{ color: "var(--text)" }}>{draft.engagementScore}/100</strong>
          </span>
        )}
      </div>

      {/* Author and Date */}
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-xs)", color: "var(--muted)" }}>
        <span>Author: {draft.author}</span>
        <span>{new Date(draft.createdAt).toLocaleDateString()}</span>
      </div>

      {/* Human Approval Gate Action Buttons */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          borderTop: "1px solid var(--line)",
          paddingTop: compact ? "0.6rem" : "0.85rem",
          marginTop: "auto",
        }}
      >
        {draft.status === "pending" && (
          <>
            <button
              className="btn primary"
              style={{ padding: "0.45rem 0.85rem", fontSize: "var(--text-xs)", flex: 1 }}
              onClick={() => onUpdateStatus(draft.id, "approved")}
            >
              ✓ Approve Post
            </button>
            <button
              className="btn secondary"
              style={{ padding: "0.45rem 0.85rem", fontSize: "var(--text-xs)" }}
              onClick={() => onUpdateStatus(draft.id, "rejected")}
            >
              ✕ Reject
            </button>
          </>
        )}

        {draft.status === "approved" && (
          <>
            <button
              className="btn primary"
              style={{
                padding: "0.45rem 0.85rem",
                fontSize: "var(--text-xs)",
                flex: 1,
                background: "var(--secondary)",
              }}
              onClick={() => onUpdateStatus(draft.id, "published")}
            >
              🚀 Publish to {draft.platform}
            </button>
            <button
              className="btn secondary"
              style={{ padding: "0.45rem 0.85rem", fontSize: "var(--text-xs)" }}
              onClick={() => onUpdateStatus(draft.id, "draft")}
            >
              Move to Draft
            </button>
          </>
        )}

        {draft.status === "draft" && (
          <button
            className="btn secondary"
            style={{ padding: "0.45rem 0.85rem", fontSize: "var(--text-xs)", width: "100%" }}
            onClick={() => onUpdateStatus(draft.id, "pending")}
          >
            Submit for Review →
          </button>
        )}

        {draft.status === "rejected" && (
          <button
            className="btn secondary"
            style={{ padding: "0.45rem 0.85rem", fontSize: "var(--text-xs)", width: "100%" }}
            onClick={() => onUpdateStatus(draft.id, "draft")}
          >
            Reopen as Draft
          </button>
        )}

        {draft.status === "published" && (
          <div style={{ fontSize: "var(--text-xs)", color: "#60a5fa", display: "flex", alignItems: "center", gap: "0.35rem" }}>
            ✓ Successfully pushed to platform API (Gate passed)
          </div>
        )}
      </div>
    </div>
  );
}
