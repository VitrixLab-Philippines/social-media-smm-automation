"use client";

import React from "react";

/** ClientManagement — CRM client management panel.
 *  Placeholder component for future client management functionality.
 */
export default function ClientManagement() {
  return (
    <section
      style={{
        padding: "1.5rem",
        borderRadius: "var(--radius-medium)",
        background: "var(--panel)",
        marginBottom: "1.5rem",
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: "1rem", fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", color: "var(--text)" }}>
        Client Management
      </h3>
      <p style={{ color: "var(--muted)", fontSize: "var(--text-xs)" }}>
        Client management functionality coming soon.
      </p>
    </section>
  );
}