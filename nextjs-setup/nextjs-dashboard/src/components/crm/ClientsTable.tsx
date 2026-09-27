"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Client, ClientStats, ClientStatus, CLIENT_STATUSES } from "@/lib/crm";
import ClientForm from "./ClientForm";
import ClientStatsCards from "./ClientStatsCards";

const statusColor: Record<ClientStatus, { bg: string; color: string }> = {
  prospect: { bg: "#fef3c7", color: "#92400e" },
  active: { bg: "#d1fae5", color: "#065f46" },
  paused: { bg: "#e0e7ff", color: "#3730a3" },
  churned: { bg: "#fee2e2", color: "#991b1b" },
};

export default function ClientsTable() {
  const [clients, setClients] = useState<Client[]>([]);
  const [stats, setStats] = useState<ClientStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ClientStatus | "all">("all");
  const [editing, setEditing] = useState<Client | null>(null);
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/crm/clients?stats=1");
      const data = await res.json();
      setClients(data.clients ?? []);
      setStats(data.stats ?? null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return clients.filter((c) => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (!q) return true;
      return [c.name, c.company, c.email, c.industry ?? "", ...c.tags]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [clients, search, statusFilter]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this client?")) return;
    const res = await fetch(`/api/crm/clients/${id}`, { method: "DELETE" });
    if (res.ok) {
      setClients((prev) => prev.filter((c) => c.id !== id));
      load();
    }
  }

  return (
    <div>
      {stats && <ClientStatsCards stats={stats} />}

      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          marginBottom: 12,
          flexWrap: "wrap",
        }}
      >
        <input
          placeholder="Search name, company, email, tag…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            minWidth: 220,
            padding: "8px 10px",
            border: "1px solid #d1d5db",
            borderRadius: 6,
            fontSize: 14,
          }}
        />
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as ClientStatus | "all")
          }
          style={{
            padding: "8px 10px",
            border: "1px solid #d1d5db",
            borderRadius: 6,
            fontSize: 14,
          }}
        >
          <option value="all">All statuses</option>
          {CLIENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          onClick={() => setCreating(true)}
          style={{
            background: "#111827",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "8px 14px",
            cursor: "pointer",
          }}
        >
          + New client
        </button>
      </div>

      {(creating || editing) && (
        <div style={{ marginBottom: 16 }}>
          <ClientForm
            initial={editing ?? undefined}
            onCancel={() => {
              setCreating(false);
              setEditing(null);
            }}
            onSaved={() => {
              setCreating(false);
              setEditing(null);
              load();
            }}
          />
        </div>
      )}

      {loading ? (
        <div style={{ color: "#6b7280" }}>Loading clients…</div>
      ) : filtered.length === 0 ? (
        <div
          style={{
            border: "1px dashed #d1d5db",
            borderRadius: 10,
            padding: 24,
            textAlign: "center",
            color: "#6b7280",
          }}
        >
          No clients match the current filters.
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 14,
            }}
          >
            <thead>
              <tr style={{ textAlign: "left", background: "#f9fafb" }}>
                <th style={{ padding: "10px 12px", fontSize: 12, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.4, borderBottom: "1px solid #e5e7eb" }}>Company</th>
                <th style={{ padding: "10px 12px", fontSize: 12, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.4, borderBottom: "1px solid #e5e7eb" }}>Contact</th>
                <th style={{ padding: "10px 12px", fontSize: 12, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.4, borderBottom: "1px solid #e5e7eb" }}>Status</th>
                <th style={{ padding: "10px 12px", fontSize: 12, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.4, borderBottom: "1px solid #e5e7eb" }}>Posts</th>
                <th style={{ padding: "10px 12px", fontSize: 12, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.4, borderBottom: "1px solid #e5e7eb" }}>Revenue</th>
                <th style={{ padding: "10px 12px", fontSize: 12, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.4, borderBottom: "1px solid #e5e7eb" }}>Manager</th>
                <th style={{ padding: "10px 12px", fontSize: 12, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.4, borderBottom: "1px solid #e5e7eb" }}>Last activity</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} style={{ borderTop: "1px solid #eef2f7" }}>
                  <td style={{ padding: "10px 12px" }}>
                    <div style={{ fontWeight: 600 }}>{c.company}</div>
                    <div style={{ color: "#6b7280", fontSize: 12 }}>{c.industry ?? "—"}</div>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <div>{c.name}</div>
                    <div style={{ color: "#6b7280", fontSize: 12 }}>{c.email}</div>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <span
                      style={{
                        background: statusColor[c.status].bg,
                        color: statusColor[c.status].color,
                        borderRadius: 999,
                        padding: "2px 10px",
                        fontSize: 12,
                        textTransform: "capitalize",
                      }}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td style={{ padding: "10px 12px" }}>{c.posts.count}</td>
                  <td style={{ padding: "10px 12px" }}>${c.revenue.toLocaleString()}</td>
                  <td style={{ padding: "10px 12px" }}>{c.accountManager ?? "—"}</td>
                  <td style={{ padding: "10px 12px" }}>
                    {new Date(c.lastActivity).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "right", whiteSpace: "nowrap" }}>
                    <button
                      onClick={() => setEditing(c)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#2563eb",
                        cursor: "pointer",
                        fontSize: 13,
                        padding: "2px 6px",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#b91c1c",
                        cursor: "pointer",
                        fontSize: 13,
                        padding: "2px 6px",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}