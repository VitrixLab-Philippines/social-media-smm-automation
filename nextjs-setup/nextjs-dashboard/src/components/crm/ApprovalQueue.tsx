"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ContentDraft, DraftStatus, Platform } from "@/lib/crm";
import ContentDraftCard from "@/components/crm/ContentDraftCard";

interface ApprovalQueueProps {
  viewMode: "grid" | "list";
  density: "spacious" | "compact";
  selectedPlatform: string;
}

export default function ApprovalQueue({
  viewMode,
  density,
  selectedPlatform,
}: ApprovalQueueProps) {
  const [drafts, setDrafts] = useState<ContentDraft[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTopic, setNewTopic] = useState("");
  const [newPlatform, setNewPlatform] = useState<Platform>("instagram");
  const [newText, setNewText] = useState("");
  const [newHashtags, setNewHashtags] = useState("#SMMAI, #Growth");
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
    let ignore = false;

    async function fetchDrafts() {
      try {
        const url = new URL("/api/crm/drafts", window.location.origin);
        if (activeTab !== "all") url.searchParams.set("status", activeTab);
        if (selectedPlatform !== "all") url.searchParams.set("platform", selectedPlatform);

        const res = await fetch(url.toString());
        if (res.ok && !ignore) {
          const data = await res.json();
          setDrafts(data.drafts || []);
          if (data.counts) setCounts(data.counts);
        }
      } catch {
        // fallback
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchDrafts();

    return () => {
      ignore = true;
    };
  }, [activeTab, selectedPlatform, refreshKey]);

  function showToast(message: string, type: "success" | "error") {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 5000);
  }

  async function handleUpdateStatus(id: string, status: DraftStatus) {
    try {
      const res = await fetch("/api/crm/drafts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setRefreshKey((k) => k + 1);
        showToast("Status updated successfully", "success");
      } else {
        const data = await res.json();
        showToast("Failed: " + (data.error || "Unknown error"), "error");
      }
    } catch {
      showToast("Error updating status. Please try again.", "error");
    }
  }

  async function handleCreateDraft(e: React.FormEvent) {
    e.preventDefault();
    try {
      const hashtags = newHashtags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await fetch("/api/crm/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: newTopic,
          platform: newPlatform,
          text: newText,
          hashtags,
          author: "Human Marketer",
        }),
      });

      if (res.ok) {
        setShowCreateModal(false);
        setNewTopic("");
        setNewText("");
        setToast({ show: false });
        loadDrafts();
      } else {
        const data = await res.json();
        showToast("Failed: " + (data.error || "Unknown error"), "error");
      }
    } catch {
      showToast("Error creating draft. Please try again.", "error");
    }
  }

  return (
    <div>
      {/* Header and Quick Actions */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "1.25rem",
        }}
      >
<div>
  <span className="eyebrow">Human Approval Pipeline</span>
  <h2 style={{ fontSize: "var(--text-xl)", fontWeight: "var(--weight-black)", color: "var(--text)", margin: 0 }}>
    Post Review & Approval Gate
  </h2>
</div>

{toast.show && (
  <div
    style={{
      background: toast.type === "success" ? "var(--primary)" : "#ef4444",
      color: "var(--bg)",
      padding: "0.75rem 1rem",
      marginBottom: "1.25rem",
      borderRadius: "var(--radius-small)",
      fontSize: "var(--text-xs)",
      textAlign: "center",
      margin: "0 1rem",
      animation: "slideIn 0.3s ease, slideOut 0.3s ease 4.7s forwards",
    }}
  >
    {toast.message}
  </div>
)}

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            className="btn primary"
            style={{ padding: "0.5rem 1rem", fontSize: "var(--text-xs)" }}
            onClick={() => setShowCreateModal(true)}
          >
            + Create New Post
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "0.25rem",
          overflowX: "auto",
          borderBottom: "1px solid var(--line)",
          paddingBottom: "0.5rem",
          marginBottom: "1.5rem",
        }}
      >
        {[
          { id: "all", label: "All Items", count: counts.all ?? drafts.length },
          { id: "pending", label: "Pending Gate", count: counts.pending ?? 0 },
          { id: "approved", label: "Approved (Ready)", count: counts.approved ?? 0 },
          { id: "draft", label: "Drafts", count: counts.draft ?? 0 },
          { id: "published", label: "Published Live", count: counts.published ?? 0 },
          { id: "rejected", label: "Rejected", count: counts.rejected ?? 0 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "0.4rem 0.85rem",
              borderRadius: "var(--radius-small)",
              background: activeTab === tab.id ? "var(--primary-light)" : "transparent",
              color: activeTab === tab.id ? "var(--primary)" : "var(--muted)",
              border: "none",
              fontSize: "var(--text-xs)",
              fontWeight: "var(--weight-bold)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              whiteSpace: "nowrap",
            }}
          >
            <span>{tab.label}</span>
            <span
              style={{
                fontSize: "0.65rem",
                padding: "0.1rem 0.35rem",
                borderRadius: "999px",
                background: activeTab === tab.id ? "var(--primary)" : "var(--surface)",
                color: activeTab === tab.id ? "var(--bg)" : "var(--muted)",
              }}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Loading state */}
      {loading && <p style={{ color: "var(--muted)", fontSize: "var(--text-sm)" }}>Loading drafts…</p>}

      {/* Drafts grid / list */}
      {!loading && drafts.length === 0 && (
        <div className="card" style={{ padding: "2.5rem", textAlign: "center" }}>
          <p style={{ color: "var(--muted)", margin: 0 }}>No content drafts matching this filter criteria.</p>
        </div>
      )}

      {!loading && drafts.length > 0 && (
        <div
          style={{
            display: "grid",
            gap: density === "compact" ? "0.75rem" : "1.25rem",
            gridTemplateColumns:
              viewMode === "list"
                ? "1fr"
                : "repeat(auto-fill, minmax(320px, 1fr))",
          }}
        >
          {drafts.map((draft) => (
            <ContentDraftCard
              key={draft.id}
              draft={draft}
              compact={density === "compact"}
              onUpdateStatus={handleUpdateStatus}
            />
          ))}
        </div>
      )}

      {/* Create Draft Modal */}
      {showCreateModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem",
          }}
        >
          <div
            className="card"
            style={{
              width: "100%",
              maxWidth: "520px",
              padding: "1.75rem",
              background: "var(--panel)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ margin: 0, fontSize: "var(--text-lg)", color: "var(--text)" }}>Create New Post Draft</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{ background: "none", border: "none", color: "var(--muted)", fontSize: "1.25rem", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDraft} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "var(--text-xs)", color: "var(--muted)", display: "block", marginBottom: "0.25rem" }}>
                  Campaign Topic / Angle
                </label>
                <input
                  required
                  placeholder="e.g. Q3 Customer Success Story"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  style={{ width: "100%", padding: "0.6rem", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-small)", color: "var(--text)" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "var(--text-xs)", color: "var(--muted)", display: "block", marginBottom: "0.25rem" }}>
                  Platform Target
                </label>
                <select
                  value={newPlatform}
                  onChange={(e) => setNewPlatform(e.target.value as Platform)}
                  style={{ width: "100%", padding: "0.6rem", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-small)", color: "var(--text)" }}
                >
                  <option value="instagram">Instagram</option>
                  <option value="meta">Meta / Facebook</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="x">X / Twitter</option>
                  <option value="tiktok">TikTok</option>
                  <option value="youtube">YouTube</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "var(--text-xs)", color: "var(--muted)", display: "block", marginBottom: "0.25rem" }}>
                  Caption / Post Copy
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write draft content here..."
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  style={{ width: "100%", padding: "0.6rem", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-small)", color: "var(--text)", resize: "vertical" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "var(--text-xs)", color: "var(--muted)", display: "block", marginBottom: "0.25rem" }}>
                  Hashtags (comma-separated)
                </label>
                <input
                  placeholder="#Product, #Automation, #AI"
                  value={newHashtags}
                  onChange={(e) => setNewHashtags(e.target.value)}
                  style={{ width: "100%", padding: "0.6rem", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-small)", color: "var(--text)" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  className="btn secondary"
                  style={{ padding: "0.5rem 1rem", fontSize: "var(--text-xs)" }}
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn primary"
                  style={{ padding: "0.5rem 1rem", fontSize: "var(--text-xs)" }}
                >
                  Save & Route to Gate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
