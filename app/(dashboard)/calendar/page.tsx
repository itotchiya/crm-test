"use client";

import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameDay, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Video, Phone, Users, Plus } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

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

const typeIcons: Record<string, React.ElementType> = {
  demo: Video,
  call: Phone,
  meeting: Users,
};

const typeColors: Record<string, string> = {
  demo: "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800",
  call: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
  meeting: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 24)); // April 2026
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: "", time: "", duration: "1h", type: "meeting", with: "", company: "" });

  useEffect(() => {
    fetch("/api/events").then(r => r.json()).then(data => { setEvents(data); setLoading(false); });
  }, []);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay = getDay(monthStart);

  const getEventsForDate = (date: Date) => events.filter(e => isSameDay(new Date(e.date), date));
  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : [];
  const todayEvents = getEventsForDate(new Date(2026, 3, 24));
  const upcomingEvents = events.filter(e => new Date(e.date) >= new Date(2026, 3, 24)).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 5);

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;
    const newEvent: CalendarEvent = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.title,
      date: selectedDate.toISOString(),
      time: formData.time,
      duration: formData.duration,
      type: formData.type,
      with: formData.with,
      company: formData.company,
    };
    setEvents([...events, newEvent]);
    setIsAddOpen(false);
    setFormData({ title: "", time: "", duration: "1h", type: "meeting", with: "", company: "" });
    toast.success("Event added!");
  };

  if (loading) {
    return <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Calendar</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Your schedule and upcoming events.</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{format(currentDate, "MMMM yyyy")}</h2>
          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <button onClick={() => { setSelectedDate(new Date(2026, 3, 24)); setIsAddOpen(true); }} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
              <div key={day} className="text-center text-xs font-medium text-slate-500 uppercase py-2">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: startDay }).map((_, i) => <div key={`empty-${i}`} className="h-24" />)}
            {days.map(day => {
              const dayEvents = getEventsForDate(day);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isTodayDate = isToday(day) && isSameDay(day, new Date(2026, 3, 24));
              return (
                <motion.div key={day.toISOString()}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    "h-24 border rounded-lg p-1.5 cursor-pointer transition-all",
                    isSelected ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20" : "border-slate-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700",
                    isTodayDate && !isSelected && "border-indigo-200 dark:border-indigo-800 bg-indigo-50/20 dark:bg-indigo-900/10"
                  )}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={cn("w-6 h-6 flex items-center justify-center text-sm font-medium rounded-full", isTodayDate ? "bg-indigo-600 text-white" : "text-slate-700 dark:text-slate-300")}>
                      {format(day, "d")}
                    </span>
                    {dayEvents.length > 0 && <span className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400">{dayEvents.length}</span>}
                  </div>
                  <div className="space-y-0.5">
                    {dayEvents.slice(0, 2).map(event => (
                      <div key={event.id} className={cn("text-[10px] px-1.5 py-0.5 rounded border truncate font-medium", typeColors[event.type])}>
                        {event.time} {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && <div className="text-[10px] text-slate-500 dark:text-slate-400 px-1.5">+{dayEvents.length - 2} more</div>}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          {isToday(new Date(2026, 3, 24)) && todayEvents.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Today&apos;s Events
              </h3>
              <div className="space-y-2">
                {todayEvents.map(event => {
                  const Icon = typeIcons[event.type] || Users;
                  return (
                    <div key={event.id} className={cn("p-2.5 rounded-lg border text-sm", typeColors[event.type])}>
                      <div className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5" />
                        <span className="font-medium truncate">{event.title}</span>
                      </div>
                      <p className="text-xs mt-0.5 opacity-80">{event.time} • with {event.with}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">
              {selectedDate ? format(selectedDate, "EEEE, MMMM do") : "Select a date"}
            </h3>
            {selectedEvents.length === 0 ? (
              <div className="text-center py-6 text-slate-400 dark:text-slate-500 text-sm">
                {selectedDate ? "No events scheduled" : "Click a date to view events"}
              </div>
            ) : (
              <div className="space-y-2">
                {selectedEvents.map(event => {
                  const Icon = typeIcons[event.type] || Users;
                  return (
                    <div key={event.id} className={cn("p-3 rounded-lg border transition-all hover:shadow-sm", typeColors[event.type])}>
                      <div className="flex items-start gap-2.5">
                        <div className="p-1.5 rounded-md bg-white/60 dark:bg-black/20 shrink-0"><Icon className="w-4 h-4" /></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold">{event.title}</p>
                          <p className="text-xs mt-0.5 opacity-80">{event.time} • {event.duration}</p>
                          <p className="text-xs mt-1 opacity-70">with {event.with} ({event.company})</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {selectedDate && (
              <button onClick={() => setIsAddOpen(true)} className="w-full mt-3 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
                + Add Event
              </button>
            )}
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
            <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Upcoming</h3>
            <div className="space-y-2.5">
              {upcomingEvents.map(event => (
                <div key={event.id} className="flex items-center gap-3 text-sm">
                  <div className="w-1 h-8 rounded-full bg-indigo-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 dark:text-white truncate">{event.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{format(new Date(event.date), "MMM d")} at {event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Event">
        <form onSubmit={handleAddEvent} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
            <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Time</label>
              <input type="time" required value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Duration</label>
              <select value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100">
                <option>30m</option><option>1h</option><option>1.5h</option><option>2h</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
            <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100">
              <option value="meeting">Meeting</option><option value="call">Call</option><option value="demo">Demo</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">With</label>
              <input value={formData.with} onChange={e => setFormData({...formData, with: e.target.value})}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company</label>
              <input value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100" />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">Add Event</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
