"use client";

import React from "react";
import { ClientStats } from "@/lib/crm";

export default function ClientStatsCards({ stats }: { stats: ClientStats }) {
  const cards = [
    { label: "Total clients", value: stats.total, accent: "#6366f1" },
    { label: "Active", value: stats.active, accent: "#10b981" },
    { label: "Prospects", value: stats.prospects, accent: "#f59e0b" },
    { label: "Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, accent: "#0ea5e9" },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 12,
        marginBottom: 16,
      }}
    >
      {cards.map((c) => (
        <div
          key={c.label}
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            padding: "12px 14px",
            background: "#fff",
          }}
        >
          <div style={{ fontSize: 12, color: "#6b7280" }}>{c.label}</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: c.accent }}>
            {c.value}
          </div>
        </div>
      ))}
    </div>
  );
}