"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Users, Briefcase, DollarSign, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface MonthlyPerformance {
  month: string;
  revenue: number;
  target: number;
  deals: number;
  customers: number;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  deals: number;
  revenue: number;
  conversion: number;
  target: number;
  avatar: string;
}

interface LeadSource {
  name: string;
  value: number;
  color: string;
}

export default function AnalyticsPage() {
  const [monthlyPerformance, setMonthlyPerformance] = useState<MonthlyPerformance[]>([]);
  const [teamPerformance, setTeamPerformance] = useState<TeamMember[]>([]);
  const [leadSources, setLeadSources] = useState<LeadSource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/metrics").then((res) => res.json()),
      fetch("/api/team").then((res) => res.json()),
      fetch("/api/lead-sources").then((res) => res.json()),
    ]).then(([metrics, team, sources]) => {
      setMonthlyPerformance(metrics);
      setTeamPerformance(team);
      setLeadSources(sources);
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

  const totalRevenue = monthlyPerformance.reduce((sum, m) => sum + m.revenue, 0);
  const totalDeals = monthlyPerformance.reduce((sum, m) => sum + m.deals, 0);
  const avgDealSize = totalDeals > 0 ? totalRevenue / totalDeals : 0;
  const totalCustomers = monthlyPerformance[monthlyPerformance.length - 1]?.customers || 0;

  const stats = [
    { label: "Total Revenue", value: `$${(totalRevenue / 100).toLocaleString()}`, change: "+18.2%", icon: DollarSign, color: "bg-indigo-50 text-indigo-600" },
    { label: "Total Deals", value: totalDeals.toString(), change: "+22.4%", icon: Briefcase, color: "bg-cyan-50 text-cyan-600" },
    { label: "Avg Deal Size", value: `$${(avgDealSize / 100).toLocaleString()}`, change: "+5.8%", icon: Target, color: "bg-amber-50 text-amber-600" },
    { label: "New Customers", value: totalCustomers.toString(), change: "+31.2%", icon: Users, color: "bg-emerald-50 text-emerald-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="text-sm text-slate-500 mt-1">Deep insights into your sales performance.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
              <div className={cn("p-2.5 rounded-lg", stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3">
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" />
                {stat.change}
              </span>
              <span className="text-xs text-slate-400">vs last year</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-1">Revenue & Deals Trend</h3>
          <p className="text-sm text-slate-500 mb-4">Monthly performance overview</p>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyPerformance} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                <Bar dataKey="deals" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={24} name="Deals" />
                <Bar dataKey="customers" fill="#06b6d4" radius={[6, 6, 0, 0]} barSize={24} name="Customers" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-1">Revenue Growth</h3>
          <p className="text-sm text-slate-500 mb-4">Cumulative revenue trajectory</p>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyPerformance} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-1">Team Performance</h3>
          <p className="text-sm text-slate-500 mb-4">Individual contributor metrics</p>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left text-xs font-medium text-slate-500 uppercase py-2 pr-4">Team Member</th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase py-2 pr-4">Deals</th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase py-2 pr-4">Revenue</th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase py-2 pr-4">Conversion</th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase py-2">Target</th>
                </tr>
              </thead>
              <tbody>
                {teamPerformance.map((member) => (
                  <tr key={member.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-sm font-semibold text-indigo-700">
                          {member.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{member.name}</p>
                          <p className="text-xs text-slate-500">{member.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-sm font-semibold text-slate-900">{member.deals}</td>
                    <td className="py-3 pr-4 text-sm font-semibold text-slate-900">${(member.revenue / 100).toLocaleString()}</td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${member.conversion * 3}%` }} />
                        </div>
                        <span className="text-xs text-slate-500">{member.conversion}%</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={cn("h-full rounded-full", member.target >= 90 ? "bg-emerald-500" : member.target >= 70 ? "bg-indigo-500" : "bg-amber-500")} style={{ width: `${member.target}%` }} />
                        </div>
                        <span className="text-xs text-slate-500">{member.target}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-1">Conversion by Source</h3>
          <p className="text-sm text-slate-500 mb-4">Lead to customer conversion</p>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={leadSources} cx="50%" cy="50%" outerRadius={90} dataKey="value" stroke="none">
                  {leadSources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {leadSources.map((source) => (
              <div key={source.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: source.color }} />
                  <span className="text-slate-600">{source.name}</span>
                </div>
                <span className="font-medium text-slate-900">{source.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
