import { NextRequest, NextResponse } from "next/server";
import { initialBrandProfile, BrandProfile } from "@/lib/crm";

let brandProfile: BrandProfile = { ...initialBrandProfile };

export async function GET() {
  return NextResponse.json({ profile: brandProfile });
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    brandProfile = {
      ...brandProfile,
      ...body,
    };
    return NextResponse.json({ success: true, profile: brandProfile });
  } catch {
    return NextResponse.json({ error: "Failed to update brand profile" }, { status: 500 });
  }
}
