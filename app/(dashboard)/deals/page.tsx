"use client";

import { useState, useEffect } from "react";
import { prisma } from "@/lib/prisma";
import { MoreHorizontal, Plus, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

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
  { id: "Lead", label: "Lead", color: "bg-slate-100 border-slate-200", badge: "bg-slate-200 text-slate-700" },
  { id: "Qualified", label: "Qualified", color: "bg-blue-50/50 border-blue-200", badge: "bg-blue-100 text-blue-700" },
  { id: "Proposal", label: "Proposal", color: "bg-amber-50/50 border-amber-200", badge: "bg-amber-100 text-amber-700" },
  { id: "Negotiation", label: "Negotiation", color: "bg-indigo-50/50 border-indigo-200", badge: "bg-indigo-100 text-indigo-700" },
  { id: "Closed Won", label: "Closed Won", color: "bg-emerald-50/50 border-emerald-200", badge: "bg-emerald-100 text-emerald-700" },
  { id: "Closed Lost", label: "Closed Lost", color: "bg-red-50/50 border-red-200", badge: "bg-red-100 text-red-700" },
];

const avatarColors: Record<string, string> = {
  indigo: "bg-indigo-100 text-indigo-700",
  purple: "bg-purple-100 text-purple-700",
  cyan: "bg-cyan-100 text-cyan-700",
  amber: "bg-amber-100 text-amber-700",
  slate: "bg-slate-100 text-slate-700",
  pink: "bg-pink-100 text-pink-700",
  emerald: "bg-emerald-100 text-emerald-700",
  red: "bg-red-100 text-red-700",
  blue: "bg-blue-100 text-blue-700",
  orange: "bg-orange-100 text-orange-700",
  violet: "bg-violet-100 text-violet-700",
  rose: "bg-rose-100 text-rose-700",
  teal: "bg-teal-100 text-teal-700",
  green: "bg-green-100 text-green-700",
};

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/deals")
      .then((res) => res.json())
      .then((data) => {
        setDeals(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  const totalPipeline = deals.reduce((sum, d) => sum + d.value, 0);
  const wonDeals = deals.filter((d) => d.stage === "Closed Won").length;
  const lostDeals = deals.filter((d) => d.stage === "Closed Lost").length;
  const winRate = wonDeals + lostDeals > 0 ? Math.round((wonDeals / (wonDeals + lostDeals)) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Deals</h1>
        <p className="text-sm text-slate-500 mt-1">Track and manage your sales pipeline.</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" /> New Deal
            </button>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span>Total Pipeline: <strong className="text-slate-900">${(totalPipeline / 100).toLocaleString()}</strong></span>
            <span className="w-px h-4 bg-slate-300"></span>
            <span>Win Rate: <strong className="text-slate-900">{winRate}%</strong></span>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2">
          {stages.map((stage) => {
            const stageDeals = deals.filter((d) => d.stage === stage.id);
            const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0);

            return (
              <div key={stage.id} className="min-w-[280px] flex-1">
                <div className={cn("rounded-xl border p-3", stage.color)}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", stage.badge)}>
                        {stageDeals.length}
                      </span>
                      <span className="text-sm font-semibold text-slate-700">{stage.label}</span>
                    </div>
                    <span className="text-xs font-medium text-slate-500">
                      ${(stageValue / 100).toLocaleString()}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {stageDeals.map((deal) => (
                      <div
                        key={deal.id}
                        className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <p className="text-sm font-medium text-slate-900 line-clamp-2">{deal.title}</p>
                          <button className="p-0.5 rounded hover:bg-slate-100 text-slate-400">
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold text-slate-900">${(deal.value / 100).toLocaleString()}</span>
                          <span className="text-xs text-slate-500">{deal.probability}% prob</span>
                        </div>

                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-2.5">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              deal.probability >= 70 ? "bg-emerald-500" :
                              deal.probability >= 40 ? "bg-indigo-500" : "bg-amber-500"
                            )}
                            style={{ width: `${deal.probability}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={cn("w-6 h-6 rounded-md flex items-center justify-center text-xs font-semibold", avatarColors[deal.color] || "bg-slate-100 text-slate-700")}>
                              {deal.avatar}
                            </div>
                            <span className="text-xs text-slate-500">{deal.company}</span>
                          </div>
                          <span className="flex items-center gap-1 text-xs text-slate-400">
                            <Calendar className="w-3 h-3" />
                            {deal.daysInStage}d
                          </span>
                        </div>
                      </div>
                    ))}
                    {stageDeals.length === 0 && (
                      <div className="text-center py-6 text-xs text-slate-400">No deals</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
