"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Video, Phone, Users } from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  type: string;
  with: string;
  company: string;
}

const daysInMonth = 31;
const firstDayOfMonth = 0;

const typeIcons: Record<string, React.ElementType> = {
  demo: Video,
  call: Phone,
  meeting: Users,
};

const typeColors: Record<string, string> = {
  demo: "bg-indigo-100 text-indigo-700 border-indigo-200",
  call: "bg-emerald-100 text-emerald-700 border-emerald-200",
  meeting: "bg-purple-100 text-purple-700 border-purple-200",
};

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      });
  }, []);

  const getEventsForDate = (day: number) => {
    const dateStr = `2024-12-${day.toString().padStart(2, "0")}`;
    return events.filter((e) => e.date.startsWith(dateStr));
  };

  const selectedEvents = selectedDate
    ? events.filter((e) => e.date.startsWith(selectedDate))
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Calendar</h1>
        <p className="text-sm text-slate-500 mt-1">Your schedule and upcoming events.</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-slate-900">December 2024</h2>
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
          + Add Event
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-slate-500 uppercase py-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="h-24"></div>
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayEvents = getEventsForDate(day);
              const isSelected = selectedDate === `2024-12-${day.toString().padStart(2, "0")}`;
              const isToday = day === 20;

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDate(`2024-12-${day.toString().padStart(2, "0")}`)}
                  className={cn(
                    "h-24 border rounded-lg p-1.5 cursor-pointer transition-all hover:border-indigo-300",
                    isSelected ? "border-indigo-500 bg-indigo-50/50" : "border-slate-100",
                    isToday && !isSelected && "border-indigo-200 bg-indigo-50/20"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={cn(
                        "w-6 h-6 flex items-center justify-center text-sm font-medium rounded-full",
                        isToday ? "bg-indigo-600 text-white" : "text-slate-700"
                      )}
                    >
                      {day}
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded border truncate font-medium",
                          typeColors[event.type]
                        )}
                      >
                        {event.time} {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-[10px] text-slate-500 px-1.5">+{dayEvents.length - 3} more</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-4">
            {selectedDate
              ? new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })
              : "Select a date"}
          </h3>

          {selectedEvents.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              No events scheduled
            </div>
          ) : (
            <div className="space-y-3">
              {selectedEvents.map((event) => {
                const Icon = typeIcons[event.type] || Users;
                return (
                  <div
                    key={event.id}
                    className={cn(
                      "p-3 rounded-lg border transition-all hover:shadow-sm",
                      typeColors[event.type]
                    )}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="p-1.5 rounded-md bg-white/60 shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold">{event.title}</p>
                        <p className="text-xs mt-0.5 opacity-80">
                          {event.time} • {event.duration}
                        </p>
                        <p className="text-xs mt-1 opacity-70">
                          with {event.with} ({event.company})
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
              Upcoming
            </h4>
            <div className="space-y-2.5">
              {events.slice(0, 4).map((event) => (
                <div key={event.id} className="flex items-center gap-3 text-sm">
                  <div className="w-1 h-8 rounded-full bg-indigo-400 shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 truncate">{event.title}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })} at {event.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
