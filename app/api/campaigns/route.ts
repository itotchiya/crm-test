import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const campaigns = await prisma.campaign.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(
      campaigns.map((c) => ({
        ...c,
        startDate: c.startDate?.toISOString().split("T")[0] || "",
        endDate: c.endDate?.toISOString().split("T")[0] || "",
      }))
    );
  } catch (error: any) {
    console.error("[API /campaigns] Error:", error?.message || error);
    return NextResponse.json(
      { error: "Database unavailable. Please retry in a few seconds." },
      { status: 500 }
    );
  }
}
