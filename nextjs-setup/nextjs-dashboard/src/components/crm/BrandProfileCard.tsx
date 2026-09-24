"use client";

import React, { useState, useEffect } from "react";
import { BrandProfile, initialBrandProfile } from "@/lib/crm";

export default function BrandProfileCard() {
  const [profile, setProfile] = useState<BrandProfile>(initialBrandProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    fetch("/api/crm/brand")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.profile) setProfile(data.profile);
      })
      .catch(() => {});
  }, []);

  async function handleSave() {
    try {
      await fetch("/api/crm/brand", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      setIsEditing(false);
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 2500);
    } catch {
      alert("Failed to save profile");
    }
  }

  return (
    <div className="card" style={{ padding: "1.75rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <div>
          <span className="eyebrow">Brand & Safety Guardrails</span>
          <h2 style={{ fontSize: "var(--text-lg)", fontWeight: "var(--weight-bold)", color: "var(--text)", margin: 0 }}>
            {profile.name}
          </h2>
        </div>
        <button
          className="btn secondary"
          style={{ padding: "0.4rem 0.85rem", fontSize: "var(--text-xs)" }}
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
        >
          {isEditing ? "Save Guardrails" : "Edit Guardrails"}
        </button>
      </div>

      {savedMessage && (
        <div style={{ padding: "0.5rem 0.75rem", marginBottom: "1rem", background: "var(--primary-light)", color: "var(--primary)", fontSize: "var(--text-xs)", borderRadius: "var(--radius-small)" }}>
          ✓ Brand guardrails updated and enforced in active AI moderation policy.
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
        {/* Audience & Voice */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div>
            <label style={{ fontSize: "var(--text-xs)", color: "var(--muted)", textTransform: "uppercase", fontWeight: "var(--weight-bold)", letterSpacing: "var(--ls-label)" }}>
              Target Audience
            </label>
            {isEditing ? (
              <input
                type="text"
                value={profile.audience}
                onChange={(e) => setProfile({ ...profile, audience: e.target.value })}
                style={{ width: "100%", padding: "0.5rem", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-small)", color: "var(--text)", marginTop: "0.25rem" }}
              />
            ) : (
              <p style={{ margin: "0.25rem 0 0", color: "var(--text)", fontSize: "var(--text-sm)" }}>{profile.audience}</p>
            )}
          </div>

          <div>
            <label style={{ fontSize: "var(--text-xs)", color: "var(--muted)", textTransform: "uppercase", fontWeight: "var(--weight-bold)", letterSpacing: "var(--ls-label)" }}>
              Brand Voice & Persona
            </label>
            {isEditing ? (
              <input
                type="text"
                value={profile.voice}
                onChange={(e) => setProfile({ ...profile, voice: e.target.value })}
                style={{ width: "100%", padding: "0.5rem", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-small)", color: "var(--text)", marginTop: "0.25rem" }}
              />
            ) : (
              <p style={{ margin: "0.25rem 0 0", color: "var(--text)", fontSize: "var(--text-sm)" }}>{profile.voice}</p>
            )}
          </div>
        </div>

        {/* Prohibited Topics */}
        <div>
          <label style={{ fontSize: "var(--text-xs)", color: "var(--muted)", textTransform: "uppercase", fontWeight: "var(--weight-bold)", letterSpacing: "var(--ls-label)" }}>
            Prohibited Topics (Enforced in Moderation Policy)
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.4rem" }}>
            {profile.prohibitedTopics.map((topic, index) => (
              <span
                key={index}
                style={{
                  fontSize: "var(--text-xs)",
                  color: "#ef4444",
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.25)",
                  padding: "0.2rem 0.5rem",
                  borderRadius: "var(--radius-small)",
                }}
              >
                ✕ {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Required Disclosures */}
        <div>
          <label style={{ fontSize: "var(--text-xs)", color: "var(--muted)", textTransform: "uppercase", fontWeight: "var(--weight-bold)", letterSpacing: "var(--ls-label)" }}>
            Required Disclosures (Appended automatically)
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.4rem" }}>
            {profile.requiredDisclosures.map((disc, index) => (
              <span
                key={index}
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--primary)",
                  background: "var(--primary-light)",
                  border: "1px solid rgba(5, 150, 105, 0.25)",
                  padding: "0.2rem 0.5rem",
                  borderRadius: "var(--radius-small)",
                }}
              >
                ✓ {disc}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
