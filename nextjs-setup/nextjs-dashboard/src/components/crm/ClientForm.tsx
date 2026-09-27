"use client";

import React, { useState } from "react";
import {
  Client,
  ClientStatus,
  CLIENT_STATUSES,
} from "@/lib/crm";

type Props = {
  initial?: Partial<Client>;
  onSaved: (client: Client) => void;
  onCancel: () => void;
};

const empty: Partial<Client> = {
  name: "",
  company: "",
  email: "",
  phone: "",
  website: "",
  industry: "",
  status: "prospect",
  approved: false,
  revenue: 0,
  accountManager: "",
  tags: [],
  notes: "",
};

export default function ClientForm({ initial, onSaved, onCancel }: Props) {
  const [form, setForm] = useState<Partial<Client>>({ ...empty, ...initial });
  const [tagsInput, setTagsInput] = useState((initial?.tags ?? []).join(", "));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = Boolean(initial?.id);

  function update<K extends keyof Client>(key: K, value: Client[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = { ...form, tags };

    try {
      const url = isEdit
        ? `/api/crm/clients/${initial!.id}`
        : "/api/crm/clients";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      onSaved(data.client as Client);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 10px",
    border: "1px solid #d1d5db",
    borderRadius: 6,
    fontSize: 14,
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 12,
    color: "#374151",
    marginBottom: 4,
    marginTop: 10,
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 10,
        padding: 16,
        background: "#fff",
      }}
    >
      <h3 style={{ margin: 0, marginBottom: 8 }}>
        {isEdit ? "Edit client" : "New client"}
      </h3>

      <label style={labelStyle}>Contact name *</label>
      <input
        style={inputStyle}
        value={form.name ?? ""}
        onChange={(e) => update("name", e.target.value)}
        required
      />

      <label style={labelStyle}>Company *</label>
      <input
        style={inputStyle}
        value={form.company ?? ""}
        onChange={(e) => update("company", e.target.value)}
        required
      />

      <label style={labelStyle}>Email *</label>
      <input
        type="email"
        style={inputStyle}
        value={form.email ?? ""}
        onChange={(e) => update("email", e.target.value)}
        required
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label style={labelStyle}>Phone</label>
          <input
            style={inputStyle}
            value={form.phone ?? ""}
            onChange={(e) => update("phone", e.target.value)}
          />
        </div>
        <div>
          <label style={labelStyle}>Website</label>
          <input
            style={inputStyle}
            value={form.website ?? ""}
            onChange={(e) => update("website", e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label style={labelStyle}>Industry</label>
          <input
            style={inputStyle}
            value={form.industry ?? ""}
            onChange={(e) => update("industry", e.target.value)}
          />
        </div>
        <div>
          <label style={labelStyle}>Account manager</label>
          <input
            style={inputStyle}
            value={form.accountManager ?? ""}
            onChange={(e) => update("accountManager", e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label style={labelStyle}>Status</label>
          <select
            style={inputStyle}
            value={form.status ?? "prospect"}
            onChange={(e) => update("status", e.target.value as ClientStatus)}
          >
            {CLIENT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Revenue (USD)</label>
          <input
            type="number"
            style={inputStyle}
            value={form.revenue ?? 0}
            onChange={(e) => update("revenue", Number(e.target.value))}
          />
        </div>
      </div>

      <label style={labelStyle}>Tags (comma separated)</label>
      <input
        style={inputStyle}
        value={tagsInput}
        onChange={(e) => setTagsInput(e.target.value)}
      />

      <label style={labelStyle}>Notes</label>
      <textarea
        style={{ ...inputStyle, minHeight: 70 }}
        value={form.notes ?? ""}
        onChange={(e) => update("notes", e.target.value)}
      />

      <label style={{ ...labelStyle, display: "flex", alignItems: "center", gap: 8 }}>
        <input
          type="checkbox"
          checked={Boolean(form.approved)}
          onChange={(e) => update("approved", e.target.checked)}
        />
        Approved for posting
      </label>

      {error && (
        <div style={{ color: "#b91c1c", fontSize: 13, marginTop: 10 }}>
          {error}
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <button
          type="submit"
          disabled={saving}
          style={{
            background: "#111827",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "8px 14px",
            cursor: saving ? "not-allowed" : "pointer",
          }}
        >
          {saving ? "Saving…" : isEdit ? "Save changes" : "Create client"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{
            background: "#fff",
            color: "#111827",
            border: "1px solid #d1d5db",
            borderRadius: 6,
            padding: "8px 14px",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}