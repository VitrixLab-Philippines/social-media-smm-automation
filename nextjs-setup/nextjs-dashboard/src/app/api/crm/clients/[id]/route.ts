import { NextRequest, NextResponse } from "next/server";
import { Client, ClientStatus, CLIENT_STATUSES, initialClients } from "@/lib/crm";

let clients: Client[] = [...initialClients];

function findIndex(id: string) {
  return clients.findIndex((c) => c.id === id);
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const client = clients.find((c) => c.id === id);
  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }
  return NextResponse.json({ client });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const idx = findIndex(id);
  if (idx === -1) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  let patch: Partial<Client>;
  try {
    patch = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (patch.status && !CLIENT_STATUSES.includes(patch.status as ClientStatus)) {
    return NextResponse.json(
      { error: `Invalid status. Allowed: ${CLIENT_STATUSES.join(", ")}` },
      { status: 400 }
    );
  }

  const current = clients[idx];
  const next: Client = {
    ...current,
    ...patch,
    id: current.id, // never allow id change
    createdAt: current.createdAt,
    updatedAt: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
  };

  clients[idx] = next;
  return NextResponse.json({ client: next });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const idx = findIndex(id);
  if (idx === -1) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }
  const [removed] = clients.splice(idx, 1);
  return NextResponse.json({ client: removed });
}