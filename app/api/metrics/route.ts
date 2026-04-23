import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const metrics = await prisma.revenueMetric.findMany({
      orderBy: { id: "asc" },
    });

    return NextResponse.json(metrics);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 });
  }
}
