import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const deals = await prisma.deal.findMany({
      include: { contact: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      deals.map((deal) => ({
        id: deal.id,
        title: deal.title,
        company: deal.contact.company,
        contact: deal.contact.name,
        value: deal.value,
        probability: deal.probability,
        daysInStage: deal.daysInStage,
        avatar: deal.avatar,
        color: deal.color,
        stage: deal.stage.replace("_", " "),
      }))
    );
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch deals" }, { status: 500 });
  }
}
