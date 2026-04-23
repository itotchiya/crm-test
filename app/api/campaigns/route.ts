import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const campaigns = await prisma.campaign.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(campaigns.map(c => ({
      ...c,
      startDate: c.startDate?.toISOString().split("T")[0] || "",
      endDate: c.endDate?.toISOString().split("T")[0] || "",
    })));
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 });
  }
}
