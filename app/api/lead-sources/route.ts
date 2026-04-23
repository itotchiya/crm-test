import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const sources = await prisma.leadSource.findMany();

    return NextResponse.json(sources);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch lead sources" }, { status: 500 });
  }
}
