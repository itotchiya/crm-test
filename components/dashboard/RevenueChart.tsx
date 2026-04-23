"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from "recharts";

interface RevenueMetric {
  month: string;
  revenue: number;
  target: number;
}

export default function RevenueChart({ data }: { data: RevenueMetric[] }) {
  const chartData = data.map((d) => ({
    month: d.month,
    revenue: d.revenue / 100,
    target: d.target / 100,
  }));

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">Revenue Overview</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">Monthly revenue vs target</p>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} tickFormatter={(v) => `$${v / 1000}k`} />
            <Tooltip
              contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
              formatter={(v: number) => [`$${v.toLocaleString()}`, ""]}
            />
            <Bar dataKey="revenue" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={24} name="Revenue" />
            <Line type="monotone" dataKey="target" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" name="Target" dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
