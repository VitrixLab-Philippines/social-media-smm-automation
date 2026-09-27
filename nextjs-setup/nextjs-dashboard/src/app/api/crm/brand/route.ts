import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await verifySession();
  const workspaceId = session?.workspaceId;

  const brand = await prisma.brandProfile.findFirst({
    where: workspaceId ? { workspaceId } : {},
  });

  return NextResponse.json({ brand });
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const session = await verifySession();
    const workspaceId = session?.workspaceId;

    // RBAC: verify or create brand within workspace
    let existing;
    if (workspaceId) {
      existing = await prisma.brandProfile.findFirst({
        where: { workspaceId },
      });
    } else {
      existing = await prisma.brandProfile.findFirst();
    }

    const brand = existing
      ? await prisma.brandProfile.update({
          where: { id: existing.id },
          data: body,
        })
      : await prisma.brandProfile.create({
          data: {
            ...body,
            workspaceId,
          },
        });

    return NextResponse.json({ brand });
  } catch {
    return NextResponse.json({ error: "Failed to update brand profile" }, { status: 500 });
  }
}