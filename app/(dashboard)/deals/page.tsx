"use client";

import { useState, useEffect } from "react";
import { DndContext, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Calendar, MoreHorizontal, X, Phone, Mail, Building2, User, CheckCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/modal";
import { moveDealStage, createDeal } from "@/lib/actions";
import { toast } from "sonner";

interface Deal {
  id: string;
  title: string;
  company: string;
  contact: string;
  value: number;
  probability: number;
  daysInStage: number;
  avatar: string;
  color: string;
  stage: string;
}

const stages = [
  { id: "Lead", label: "Lead", color: "bg-slate-100 border-slate-200 dark:bg-slate-800 dark:border-slate-700", badge: "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300" },
  { id: "Qualified", label: "Qualified", color: "bg-blue-50/50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800", badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
  { id: "Proposal", label: "Proposal", color: "bg-amber-50/50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800", badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" },
  { id: "Negotiation", label: "Negotiation", color: "bg-indigo-50/50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800", badge: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300" },
  { id: "Closed Won", label: "Closed Won", color: "bg-emerald-50/50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800", badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" },
  { id: "Closed Lost", label: "Closed Lost", color: "bg-red-50/50 border-red-200 dark:bg-red-900/20 dark:border-red-800", badge: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" },
];

const avatarColors: Record<string, string> = {
  indigo: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300",
  purple: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
  cyan: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
  slate: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  pink: "bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300",
  emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
  red: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
  blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
  orange: "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300",
  violet: "bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300",
  rose: "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300",
  teal: "bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300",
  green: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
};

const stageColors: Record<string, string> = {
  Lead: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  Qualified: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  Proposal: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  Negotiation: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  "Closed Won": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Closed Lost": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

function SortableDealCard({ deal, onClick }: { deal: Deal; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: deal.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: isDragging ? 0.5 : 1, scale: isDragging ? 1.02 : 1 }}
      whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.1)" }}
      onClick={onClick}
      className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3 shadow-sm cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-start justify-between mb-2">
        <p className="text-sm font-medium text-slate-900 dark:text-slate-100 line-clamp-2">{deal.title}</p>
        <button className="p-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400">
          <MoreHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-bold text-slate-900 dark:text-slate-100">${(deal.value / 100).toLocaleString()}</span>
        <span className="text-xs text-slate-500 dark:text-slate-400">{deal.probability}% prob</span>
      </div>
      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-2.5">
        <div className={cn("h-full rounded-full", deal.probability >= 70 ? "bg-emerald-500" : deal.probability >= 40 ? "bg-indigo-500" : "bg-amber-500")} style={{ width: `${deal.probability}%` }} />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn("w-6 h-6 rounded-md flex items-center justify-center text-xs font-semibold", avatarColors[deal.color] || "bg-slate-100 text-slate-700")}>
            {deal.avatar}
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">{deal.company}</span>
        </div>
        <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
          <Calendar className="w-3 h-3" />{deal.daysInStage}d
        </span>
      </div>
    </motion.div>
  );
}

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [contacts, setContacts] = useState<{ id: string; name: string; company: string }[]>([]);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    fetch("/api/deals").then(r => r.json()).then(setDeals).finally(() => setLoading(false));
    fetch("/api/contacts").then(r => r.json()).then(setContacts).catch(() => {});
  }, []);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const dealId = active.id as string;
    const newStage = over.id as string;
    const deal = deals.find(d => d.id === dealId);
    if (!deal || deal.stage === newStage) return;

    setDeals(deals.map(d => d.id === dealId ? { ...d, stage: newStage, daysInStage: 0 } : d));
    try {
      await moveDealStage(dealId, newStage);
      toast.success(`Deal moved to ${newStage}`);
    } catch (error) {
      toast.error("Failed to move deal");
      setDeals(deals);
    }
  };

  const openDetail = (deal: Deal) => {
    setSelectedDeal(deal);
    setIsDetailOpen(true);
  };

  const totalPipeline = deals.reduce((sum, d) => sum + d.value, 0);
  const wonDeals = deals.filter(d => d.stage === "Closed Won").length;
  const lostDeals = deals.filter(d => d.stage === "Closed Lost").length;
  const winRate = wonDeals + lostDeals > 0 ? Math.round((wonDeals / (wonDeals + lostDeals)) * 100) : 0;

  if (loading) {
    return <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Deals</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track and manage your sales pipeline.</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => setIsAddOpen(true)} className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Deal
          </button>
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
          <span>Total Pipeline: <strong className="text-slate-900 dark:text-white">${(totalPipeline / 100).toLocaleString()}</strong></span>
          <span className="w-px h-4 bg-slate-300 dark:bg-slate-600"></span>
          <span>Win Rate: <strong className="text-slate-900 dark:text-white">{winRate}%</strong></span>
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {stages.map(stage => {
            const stageDeals = deals.filter(d => d.stage === stage.id);
            const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0);
            return (
              <div key={stage.id} className="min-w-[280px] flex-1">
                <div className={cn("rounded-xl border p-3", stage.color)}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", stage.badge)}>{stageDeals.length}</span>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{stage.label}</span>
                    </div>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">${(stageValue / 100).toLocaleString()}</span>
                  </div>
                  <SortableContext items={stageDeals.map(d => d.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2.5 min-h-[100px]">
                      <AnimatePresence>
                        {stageDeals.map(deal => (
                          <SortableDealCard key={deal.id} deal={deal} onClick={() => openDetail(deal)} />
                        ))}
                      </AnimatePresence>
                      {stageDeals.length === 0 && <div className="text-center py-6 text-xs text-slate-400 dark:text-slate-500">No deals</div>}
                    </div>
                  </SortableContext>
                </div>
              </div>
            );
          })}
        </div>
      </DndContext>

      {/* Deal Detail Modal */}
      <Modal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} title="Deal Details" className="max-w-xl">
        {selectedDeal && (
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 flex items-center justify-center text-lg font-bold text-indigo-700 dark:text-indigo-300 shrink-0">
                {selectedDeal.avatar}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{selectedDeal.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{selectedDeal.company}</p>
                <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium mt-2 inline-block", stageColors[selectedDeal.stage])}>
                  {selectedDeal.stage}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Value</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">${(selectedDeal.value / 100).toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Probability</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{selectedDeal.probability}%</p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Contact</h4>
              <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-900/50 flex items-center justify-center">
                  <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{selectedDeal.contact}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Primary Contact</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-900/50 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{selectedDeal.company}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">Edit Deal</button>
              <button className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Archive</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
