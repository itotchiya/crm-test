import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const deals = await prisma.deal.findMany({
      include: { contact: true },
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json(
      deals.map((d) => ({
        id: d.id,
        title: d.title,
        company: d.contact.company,
        contact: d.contact.name,
        value: d.value,
        probability: d.probability,
        daysInStage: Math.floor(
          (Date.now() - new Date(d.updatedAt).getTime()) /
            (1000 * 60 * 60 * 24)
        ),
        avatar:
          d.avatar ||
          d.contact.company
            .split(" ")
            .map((w: string) => w[0])
            .join("")
            .toUpperCase(),
        color: d.color || "indigo",
        stage: d.stage.replace("_", " "),
      }))
    );
  } catch (error: any) {
    console.error("[API /deals] Error:", error?.message || error);
    return NextResponse.json(
      { error: "Database unavailable. Please retry in a few seconds." },
      { status: 500 }
    );
  }
}
