import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: "desc" },
      include: { assigned: { select: { name: true } } },
    });
    return NextResponse.json(contacts);
  } catch (error: any) {
    console.error("[API /contacts] Error:", error?.message || error);
    return NextResponse.json(
      { error: "Database unavailable. Please retry in a few seconds." },
      { status: 500 }
    );
  }
}
