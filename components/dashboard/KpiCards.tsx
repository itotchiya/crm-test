import { TrendingUp, TrendingDown, DollarSign, Users, Briefcase, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface Kpi {
  title: string;
  value: string;
  change: string;
  period: string;
  trend: "up" | "down";
}

const iconMap: Record<string, React.ElementType> = {
  "Total Revenue": DollarSign,
  "Active Customers": Users,
  "Open Deals": Briefcase,
  "Conversion Rate": Target,
};

const colorMap: Record<string, string> = {
  "Total Revenue": "bg-indigo-50 text-indigo-600",
  "Active Customers": "bg-cyan-50 text-cyan-600",
  "Open Deals": "bg-amber-50 text-amber-600",
  "Conversion Rate": "bg-emerald-50 text-emerald-600",
};

export default function KpiCards({ kpis }: { kpis: Kpi[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => {
        const Icon = iconMap[kpi.title] || DollarSign;
        const colorClass = colorMap[kpi.title] || "bg-slate-50 text-slate-600";
        const isUp = kpi.trend === "up";

        return (
          <div
            key={kpi.title}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-500 mb-1">{kpi.title}</p>
                <p className="text-2xl font-bold text-slate-900">{kpi.value}</p>
              </div>
              <div className={cn("p-2.5 rounded-lg", colorClass)}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3">
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full",
                  isUp ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                )}
              >
                {isUp ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {kpi.change}
              </span>
              <span className="text-xs text-slate-400">{kpi.period}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
