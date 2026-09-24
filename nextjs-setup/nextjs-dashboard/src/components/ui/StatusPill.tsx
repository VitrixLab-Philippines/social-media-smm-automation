import React from "react";
import { DraftStatus } from "@/lib/crm";

interface StatusPillProps {
  status: DraftStatus;
}

export default function StatusPill({ status }: StatusPillProps) {
  const config: Record<DraftStatus, { label: string; bg: string; color: string; border: string }> = {
    pending: {
      label: "Pending Review",
      bg: "rgba(245, 158, 11, 0.12)",
      color: "#f59e0b",
      border: "rgba(245, 158, 11, 0.3)",
    },
    approved: {
      label: "Approved",
      bg: "rgba(5, 150, 105, 0.15)",
      color: "var(--primary)",
      border: "rgba(5, 150, 105, 0.35)",
    },
    draft: {
      label: "Draft",
      bg: "rgba(113, 133, 121, 0.12)",
      color: "var(--muted)",
      border: "var(--line)",
    },
    rejected: {
      label: "Rejected",
      bg: "rgba(239, 68, 68, 0.12)",
      color: "#ef4444",
      border: "rgba(239, 68, 68, 0.3)",
    },
    published: {
      label: "Published Live",
      bg: "rgba(37, 99, 235, 0.12)",
      color: "#60a5fa",
      border: "rgba(37, 99, 235, 0.3)",
    },
  };

  const current = config[status] || config.draft;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35rem",
        fontSize: "var(--text-xs)",
        fontWeight: "var(--weight-bold)",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        padding: "0.25em 0.65em",
        borderRadius: "var(--radius-small)",
        background: current.bg,
        color: current.color,
        border: `1px solid ${current.border}`,
        lineHeight: 1.2,
      }}
    >
      <span
        style={{
          width: "5px",
          height: "5px",
          borderRadius: "50%",
          background: current.color,
        }}
      />
      {current.label}
    </span>
  );
}
