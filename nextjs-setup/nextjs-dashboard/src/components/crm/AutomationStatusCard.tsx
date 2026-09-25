"use client";

import React, { useState } from "react";

export default function AutomationStatusCard() {
  const [dryRun, setDryRun] = useState(true);
  const [wasmRanking, setWasmRanking] = useState(true);

  return (
    <div className="card" style={{ padding: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div>
          <span className="eyebrow">Engine Controls</span>
          <h3 style={{ fontSize: "var(--text-md)", fontWeight: "var(--weight-bold)", color: "var(--text)", margin: 0 }}>
            Automation & Policy Gates
          </h3>
        </div>
        <span
          style={{
            fontSize: "var(--text-xs)",
            fontWeight: "var(--weight-bold)",
            color: "var(--primary)",
            background: "var(--primary-light)",
            padding: "0.2rem 0.6rem",
            borderRadius: "999px",
            border: "1px solid rgba(5,150,105,0.3)",
          }}
        >
          System Healthy
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
        {/* Dry-run safety toggle */}
        <div style={{ background: "var(--surface)", padding: "0.85rem", borderRadius: "var(--radius-small)", border: "1px solid var(--line)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
            <span style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", color: "var(--text)" }}>
              DRY_RUN Mode
            </span>
            <button
              onClick={() => setDryRun(!dryRun)}
              style={{
                fontSize: "var(--text-xs)",
                fontWeight: "var(--weight-bold)",
                padding: "0.2rem 0.6rem",
                borderRadius: "var(--radius-small)",
                background: dryRun ? "var(--primary)" : "rgba(239,68,68,0.2)",
                color: dryRun ? "var(--bg)" : "#ef4444",
                border: "none",
                cursor: "pointer",
              }}
            >
              {dryRun ? "ENABLED (SAFE)" : "LIVE"}
            </button>
          </div>
          <p style={{ fontSize: "var(--text-xs)", color: "var(--muted)", margin: 0 }}>
            {dryRun
              ? "Meta & social adapters simulate responses without live posting."
              : "CAUTION: External live posts enabled for approved drafts."}
          </p>
        </div>

        {/* Human Gate Guarantee */}
        <div style={{ background: "var(--surface)", padding: "0.85rem", borderRadius: "var(--radius-small)", border: "1px solid var(--line)" }}>
          <div style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", color: "var(--text)", marginBottom: "0.25rem" }}>
            Human Approval Gate
          </div>
          <p style={{ fontSize: "var(--text-xs)", color: "var(--primary)", margin: 0, fontWeight: "var(--weight-medium)" }}>
            ✓ 100% strictly enforced. Unapproved drafts cannot trigger publish service.
          </p>
        </div>

        {/* Moderation Filter */}
        <div style={{ background: "var(--surface)", padding: "0.85rem", borderRadius: "var(--radius-small)", border: "1px solid var(--line)" }}>
          <div style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", color: "var(--text)", marginBottom: "0.25rem" }}>
            Moderation Policy Engine
          </div>
          <p style={{ fontSize: "var(--text-xs)", color: "var(--muted)", margin: 0 }}>
            Active pre-publish checks reject prohibited topics and disclosures.
          </p>
        </div>

        {/* WASM Signal Ranking */}
        <div style={{ background: "var(--surface)", padding: "0.85rem", borderRadius: "var(--radius-small)", border: "1px solid var(--line)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
            <span style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", color: "var(--text)" }}>
              WASM Signal Engine
            </span>
            <button
              onClick={() => setWasmRanking(!wasmRanking)}
              style={{
                fontSize: "var(--text-xs)",
                fontWeight: "var(--weight-bold)",
                padding: "0.2rem 0.6rem",
                borderRadius: "var(--radius-small)",
                background: wasmRanking ? "var(--primary-light)" : "var(--surface)",
                color: wasmRanking ? "var(--primary)" : "var(--muted)",
                border: "1px solid var(--line)",
                cursor: "pointer",
              }}
            >
              {wasmRanking ? "Rust WASM" : "Python Fallback"}
            </button>
          </div>
          <p style={{ fontSize: "var(--text-xs)", color: "var(--muted)", margin: 0 }}>
            High-speed signal prioritization for trending content planning.
          </p>
        </div>
      </div>
    </div>
  );
}
