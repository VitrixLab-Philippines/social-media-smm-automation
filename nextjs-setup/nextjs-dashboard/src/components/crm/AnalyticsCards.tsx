import React from "react";
import { initialAnalytics } from "@/lib/crm";

export default function AnalyticsCards() {
  return (
    <div>
      <div style={{ marginBottom: "1.25rem" }}>
        <span className="eyebrow">Performance Feedback Loop</span>
        <h2 style={{ fontSize: "var(--text-lg)", fontWeight: "var(--weight-bold)", color: "var(--text)", margin: 0 }}>
          Multi-Platform Analytics & Topic Scoring
        </h2>
        <p style={{ color: "var(--muted)", margin: "0.25rem 0 0", fontSize: "var(--text-sm)" }}>
          Normalized engagement rates feed directly into topic ranking to prioritize high-converting angles.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" }}>
        {initialAnalytics.map((metric) => (
          <div key={metric.platform} className="card" style={{ padding: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <span
                style={{
                  fontSize: "var(--text-xs)",
                  fontWeight: "var(--weight-black)",
                  textTransform: "uppercase",
                  color: "var(--text)",
                }}
              >
                {metric.platform}
              </span>
              <span
                style={{
                  fontSize: "var(--text-xs)",
                  fontWeight: "var(--weight-bold)",
                  color: "var(--primary)",
                  background: "var(--primary-light)",
                  padding: "0.15rem 0.45rem",
                  borderRadius: "var(--radius-small)",
                }}
              >
                {metric.change}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "var(--text-2xl)", fontWeight: "var(--weight-black)", color: "var(--text)" }}>
                {metric.rate}%
              </span>
              <span style={{ fontSize: "var(--text-xs)", color: "var(--muted)" }}>Engagement Rate</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", fontSize: "var(--text-xs)", color: "var(--muted)", borderTop: "1px solid var(--line)", paddingTop: "0.6rem" }}>
              <div>
                Impressions: <strong style={{ color: "var(--text)" }}>{metric.impressions.toLocaleString()}</strong>
              </div>
              <div>
                Clicks: <strong style={{ color: "var(--text)" }}>{metric.clicks.toLocaleString()}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
