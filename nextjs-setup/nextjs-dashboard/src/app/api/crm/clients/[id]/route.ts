import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const ClientStatus = ["PROSPECT", "ACTIVE", "PAUSED", "CHURNED"] as const;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const client = await prisma.client.findUnique({ where: { id } });
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

  let patch: Record<string, unknown>;
  try {
    patch = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (
    patch.status &&
    !Object.values(ClientStatus).includes(patch.status as any)
  ) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    const client = await prisma.client.update({
      where: { id },
      data: patch,
    });
    return NextResponse.json({ client });
  } catch {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const client = await prisma.client.delete({ where: { id } });
    return NextResponse.json({ client });
  } catch {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }
}