import { cn } from "@/lib/utils";

interface PipelineItem {
  stage: string;
  deals: number;
  value: number;
}

export default function DealPipeline({ data }: { data: PipelineItem[] }) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">Deal Pipeline</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">Deals by stage</p>
      </div>
      <div className="space-y-4">
        {data.map((item) => {
          const percentage = (item.value / maxValue) * 100;
          return (
            <div key={item.stage}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.stage}</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {item.deals} deals · ${item.value.toLocaleString()}
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    item.stage === "Closed Won" ? "bg-emerald-500" : "bg-indigo-500"
                  )}
                  style={{ width: `${Math.max(percentage, 5)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
