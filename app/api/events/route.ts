import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const events = await prisma.calendarEvent.findMany({
      orderBy: { date: "asc" },
    });

    return NextResponse.json(
      events.map((e) => ({
        id: e.id,
        title: e.title,
        date: e.date.toISOString(),
        time: e.time,
        duration: e.duration,
        type: e.type,
        with: e.with,
        company: e.company,
      }))
    );
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}
