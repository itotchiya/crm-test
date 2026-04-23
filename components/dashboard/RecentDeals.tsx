import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Deal {
  id: string;
  company: string;
  contact: string;
  value: string;
  stage: string;
  probability: number;
  date: string;
  avatar: string;
}

const stageColors: Record<string, string> = {
  Lead: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
  Qualified: "bg-blue-100 text-blue-700",
  Proposal: "bg-amber-100 text-amber-700",
  Negotiation: "bg-indigo-100 text-indigo-700",
  "Closed Won": "bg-emerald-100 text-emerald-700",
  "Closed Lost": "bg-red-100 text-red-700",
};

export default function RecentDeals({ deals }: { deals: Deal[] }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Recent Deals</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Latest deal updates</p>
        </div>
        <Link href="/deals" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
          View all <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="space-y-3">
        {deals.map((deal) => (
          <div key={deal.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-sm font-semibold text-indigo-700">
                {deal.avatar}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{deal.company}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{deal.contact}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{deal.value}</p>
              <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", stageColors[deal.stage] || "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300")}>
                {deal.stage}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
