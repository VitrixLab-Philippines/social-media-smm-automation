import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const brand = await prisma.brandProfile.findFirst();
  return NextResponse.json({ brand });
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const existing = await prisma.brandProfile.findFirst();

    const brand = existing
      ? await prisma.brandProfile.update({
          where: { id: existing.id },
          data: body,
        })
      : await prisma.brandProfile.create({
          data: {
            name: String(body.name ?? ""),
            audience: String(body.audience ?? ""),
            voice: String(body.voice ?? ""),
            prohibitedTopics: Array.isArray(body.prohibitedTopics)
              ? body.prohibitedTopics
              : [],
            requiredDisclosures: Array.isArray(body.requiredDisclosures)
              ? body.requiredDisclosures
              : [],
          },
        });

    return NextResponse.json({ brand });
  } catch {
    return NextResponse.json({ error: "Failed to update brand profile" }, { status: 500 });
  }
}