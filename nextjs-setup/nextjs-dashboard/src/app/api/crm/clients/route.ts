import { NextRequest, NextResponse } from "next/server";
import {
  Client,
  ClientStatus,
  CLIENT_STATUSES,
  initialClients,
} from "@/lib/crm";

// In-memory store (same pattern as drafts)
let clients: Client[] = [...initialClients];

function nowISO() {
  return new Date().toISOString();
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const search = url.searchParams.get("search")?.toLowerCase().trim();
  const includeStats = url.searchParams.get("stats") === "1";

  let result = [...clients];

  if (status && CLIENT_STATUSES.includes(status as ClientStatus)) {
    result = result.filter((c) => c.status === status);
  }

  if (search) {
    result = result.filter((c) =>
      [c.name, c.company, c.email, c.industry ?? "", ...c.tags]
        .join(" ")
        .toLowerCase()
        .includes(search)
    );
  }

  // newest activity first
  result.sort((a, b) => (a.lastActivity < b.lastActivity ? 1 : -1));

  const body: Record<string, unknown> = { clients: result };
  if (includeStats) {
    body.stats = {
      total: clients.length,
      active: clients.filter((c) => c.status === "active").length,
      prospects: clients.filter((c) => c.status === "prospect").length,
      churned: clients.filter((c) => c.status === "churned").length,
      totalRevenue: clients.reduce((sum, c) => sum + c.revenue, 0),
      totalPosts: clients.reduce((sum, c) => sum + c.posts.count, 0),
    };
  }

  return NextResponse.json(body);
}

export async function POST(req: NextRequest) {
  let payload: Partial<Client>;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!payload.name || !payload.email || !payload.company) {
    return NextResponse.json(
      { error: "name, email, and company are required" },
      { status: 400 }
    );
  }

  const status: ClientStatus = CLIENT_STATUSES.includes(
    payload.status as ClientStatus
  )
    ? (payload.status as ClientStatus)
    : "prospect";

  const ts = nowISO();
  const client: Client = {
    id: `cl-${Date.now().toString(36)}`,
    name: payload.name.trim(),
    company: payload.company.trim(),
    email: payload.email.trim(),
    phone: payload.phone?.trim() || undefined,
    website: payload.website?.trim() || undefined,
    industry: payload.industry?.trim() || undefined,
    status,
    approved: payload.approved ?? false,
    posts: payload.posts ?? { count: 0, lastPost: null },
    revenue: typeof payload.revenue === "number" ? payload.revenue : 0,
    accountManager: payload.accountManager?.trim() || undefined,
    tags: Array.isArray(payload.tags) ? payload.tags : [],
    notes: payload.notes?.trim() || undefined,
    lastActivity: ts,
    createdAt: ts,
    updatedAt: ts,
  };

  clients = [client, ...clients];
  return NextResponse.json({ client }, { status: 201 });
}

// Used by tests / dev reset
export async function DELETE() {
  clients = [...initialClients];
  return NextResponse.json({ ok: true });
}