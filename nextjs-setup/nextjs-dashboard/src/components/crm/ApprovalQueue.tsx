"use client";

import React, { useCallback, useEffect, useState } from "react";
import { ContentDraft, DraftStatus, Platform } from "@/lib/crm";
import ContentDraftCard from "@/components/crm/ContentDraftCard";

interface ApprovalQueueProps { selectedPlatform: string; }

const tabs = [
  { id: "all", label: "All items" },
  { id: "pending", label: "Needs review" },
  { id: "approved", label: "Approved" },
  { id: "draft", label: "Drafts" },
  { id: "scheduled", label: "Scheduled" },
  { id: "published", label: "Published" },
  { id: "rejected", label: "Rejected" },
];

export default function ApprovalQueue({ selectedPlatform }: ApprovalQueueProps) {
  const [drafts, setDrafts] = useState<ContentDraft[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTopic, setNewTopic] = useState("");
  const [newPlatform, setNewPlatform] = useState<Platform>("instagram");
  const [newText, setNewText] = useState("");
  const [newHashtags, setNewHashtags] = useState("#SMMAI, #Growth");
  const [notice, setNotice] = useState("");

  const loadDrafts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const url = new URL("/api/crm/drafts", window.location.origin);
      if (activeTab !== "all") url.searchParams.set("status", activeTab);
      if (selectedPlatform !== "all") url.searchParams.set("platform", selectedPlatform);
      const res = await fetch(url.toString(), { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to load drafts.");
      setDrafts(Array.isArray(data.drafts) ? data.drafts : []);
      setCounts(data.counts || {});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load drafts.");
      setDrafts([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, selectedPlatform]);

  useEffect(() => { Promise.resolve().then(() => loadDrafts()); }, [loadDrafts]);

  useEffect(() => {
    if (!showCreateModal) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowCreateModal(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [showCreateModal]);

  async function handleUpdateStatus(id: string, status: DraftStatus) {
    setNotice("");
    try {
      const res = await fetch("/api/crm/drafts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Status update failed.");
      setNotice(status === "approved" ? "Draft approved and ready for publishing." : "Draft status updated.");
      await loadDrafts();
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Status update failed.");
    }
  }

  async function handleCreateDraft(event: React.FormEvent) {
    event.preventDefault();
    setNotice("");
    try {
      const res = await fetch("/api/crm/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: newTopic.trim(),
          platform: newPlatform,
          text: newText.trim(),
          hashtags: newHashtags.split(",").map((tag) => tag.trim()).filter(Boolean),
          author: "Human Marketer",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Draft creation failed.");
      setShowCreateModal(false);
      setNewTopic("");
      setNewText("");
      setNewHashtags("#SMMAI, #Growth");
      setNotice("Draft created and routed to the approval gate.");
      await loadDrafts();
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Draft creation failed.");
    }
  }

  return (
    <section aria-labelledby="approval-queue-heading">
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: "1rem", marginBottom: "1rem" }}>
        <div>
          <span className="eyebrow">Publishing pipeline</span>
          <h2 id="approval-queue-heading" style={{ margin: 0, fontSize: "var(--text-xl)", fontWeight: "var(--weight-black)" }}>Content review queue</h2>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <div role="group" aria-label="Content view" style={{ display: "inline-flex", border: "1px solid var(--line)", borderRadius: "var(--radius-medium)", padding: 2, background: "var(--surface)" }}>
            {(["grid", "list"] as const).map((mode) => (
              <button key={mode} type="button" aria-pressed={viewMode === mode} onClick={() => setViewMode(mode)}
                style={{ border: 0, borderRadius: "var(--radius-small)", padding: "0.4rem 0.6rem", background: viewMode === mode ? "var(--primary)" : "transparent", color: viewMode === mode ? "var(--bg)" : "var(--muted)", cursor: "pointer", font: "inherit", fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)" }}>
                {mode === "grid" ? "Grid" : "List"}
              </button>
            ))}
          </div>
          <button type="button" className="btn primary" style={{ padding: "0.55rem 0.85rem", fontSize: "var(--text-xs)" }} onClick={() => setShowCreateModal(true)}>+ New draft</button>
        </div>
      </div>

      <div role="tablist" aria-label="Draft status" style={{ display: "flex", gap: "0.25rem", overflowX: "auto", borderBottom: "1px solid var(--line)", paddingBottom: "0.5rem", marginBottom: "1rem" }}>
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button key={tab.id} type="button" role="tab" aria-selected={active} onClick={() => setActiveTab(tab.id)}
              style={{ flexShrink: 0, border: "1px solid " + (active ? "rgba(5,150,105,0.35)" : "transparent"), borderRadius: "var(--radius-small)", background: active ? "var(--primary-light)" : "transparent", color: active ? "var(--primary)" : "var(--muted)", padding: "0.4rem 0.65rem", cursor: "pointer", font: "inherit", fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)" }}>
              {tab.label} <span style={{ marginLeft: 4, opacity: 0.75 }}>{counts[tab.id] ?? 0}</span>
            </button>
          );
        })}
      </div>

      {notice && <div role="status" style={{ marginBottom: "1rem", padding: "0.65rem 0.8rem", border: "1px solid var(--line)", borderRadius: "var(--radius-small)", background: "var(--surface)", color: "var(--text)", fontSize: "var(--text-xs)" }}>{notice}</div>}
      {error && <div role="alert" style={{ marginBottom: "1rem", padding: "0.75rem", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "var(--radius-small)", background: "rgba(239,68,68,0.08)", color: "var(--text)", fontSize: "var(--text-sm)" }}>{error}</div>}

      {loading ? (
        <div className="card" style={{ padding: "2rem", color: "var(--muted)" }}>Loading content…</div>
      ) : drafts.length === 0 ? (
        <div className="card" style={{ padding: "2.5rem 1.5rem", textAlign: "center" }}>
          <strong style={{ display: "block", fontSize: "var(--text-md)" }}>Nothing here yet</strong>
          <p style={{ margin: "0.4rem 0 1rem", color: "var(--muted)", fontSize: "var(--text-sm)" }}>Try another filter or create a new draft.</p>
          <button type="button" className="btn secondary" style={{ padding: "0.5rem 0.8rem", fontSize: "var(--text-xs)" }} onClick={() => setShowCreateModal(true)}>Create draft</button>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: viewMode === "grid" ? "repeat(auto-fill, minmax(min(100%, 320px), 1fr))" : "1fr" }}>
          {drafts.map((draft) => (
            <ContentDraftCard key={draft.id} draft={draft} compact={viewMode === "list"} onApprove={(id) => void handleUpdateStatus(id, "approved")} onReject={(id) => void handleUpdateStatus(id, "rejected")} onUpdateStatus={(id, status) => void handleUpdateStatus(id, status)} />
          ))}
        </div>
      )}

      {showCreateModal && (
        <div role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) setShowCreateModal(false); }}
          style={{ position: "fixed", inset: 0, zIndex: 100, padding: "1rem", display: "grid", placeItems: "center", background: "rgba(0,0,0,0.72)" }}>
          <div role="dialog" aria-modal="true" aria-labelledby="create-draft-title" className="card" style={{ width: "min(100%, 560px)", maxHeight: "90vh", overflowY: "auto", padding: "1.5rem", background: "var(--panel)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", marginBottom: "1rem" }}>
              <div><span className="eyebrow">Content workspace</span><h3 id="create-draft-title" style={{ margin: 0, fontSize: "var(--text-lg)" }}>Create draft</h3></div>
              <button type="button" aria-label="Close create draft dialog" onClick={() => setShowCreateModal(false)} style={{ width: 34, height: 34, border: "1px solid var(--line)", borderRadius: "var(--radius-small)", background: "var(--surface)", color: "var(--text)", cursor: "pointer" }}>×</button>
            </div>
            <form onSubmit={handleCreateDraft} style={{ display: "grid", gap: "1rem" }}>
              <label style={fieldLabel}>Campaign topic<input required value={newTopic} onChange={(event) => setNewTopic(event.target.value)} placeholder="Q3 customer success story" style={fieldStyle} /></label>
              <label style={fieldLabel}>Platform<select value={newPlatform} onChange={(event) => setNewPlatform(event.target.value as Platform)} style={fieldStyle}>{["instagram","meta","linkedin","x","tiktok","youtube"].map((platform) => <option key={platform} value={platform}>{platform}</option>)}</select></label>
              <label style={fieldLabel}>Post copy<textarea required rows={6} value={newText} onChange={(event) => setNewText(event.target.value)} placeholder="Write the draft content…" style={{ ...fieldStyle, resize: "vertical" }} /></label>
              <label style={fieldLabel}>Hashtags<input value={newHashtags} onChange={(event) => setNewHashtags(event.target.value)} placeholder="#product, #automation" style={fieldStyle} /></label>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", paddingTop: "0.25rem" }}>
                <button type="button" className="btn secondary" style={{ padding: "0.55rem 0.8rem", fontSize: "var(--text-xs)" }} onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button type="submit" className="btn primary" style={{ padding: "0.55rem 0.8rem", fontSize: "var(--text-xs)" }}>Create & review</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

const fieldLabel: React.CSSProperties = { display: "grid", gap: "0.35rem", color: "var(--muted)", fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)" };
const fieldStyle: React.CSSProperties = { width: "100%", minHeight: 40, padding: "0.6rem 0.7rem", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-small)", color: "var(--text)", font: "inherit", fontSize: "var(--text-sm)" };
