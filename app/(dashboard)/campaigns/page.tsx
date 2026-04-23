import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { Play, Pause, Eye, Mail, Users, MessageSquare, BarChart3, TrendingUp } from "lucide-react";

const statusStyles: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Completed: "bg-slate-50 text-slate-600 border-slate-200",
  Draft: "bg-amber-50 text-amber-700 border-amber-200",
};

const typeIcons: Record<string, React.ElementType> = {
  Email: Mail,
  "Multi-channel": MessageSquare,
  Webinar: Users,
  Social: BarChart3,
};

export default async function CampaignsPage() {
  const campaigns = await prisma.campaign.findMany({ orderBy: { createdAt: "desc" } });

  const activeCount = campaigns.filter((c) => c.status === "Active").length;
  const totalSent = campaigns.reduce((sum, c) => sum + c.sent, 0);
  const totalRevenue = campaigns.reduce((sum, c) => sum + c.revenue, 0);

  const stats = [
    { label: "Active Campaigns", value: activeCount.toString(), subtext: `${activeCount} ending this month`, icon: Play, color: "bg-emerald-50 text-emerald-600" },
    { label: "Total Emails Sent", value: totalSent.toLocaleString(), subtext: "+18% from last month", icon: Mail, color: "bg-indigo-50 text-indigo-600" },
    { label: "Total Revenue", value: `$${(totalRevenue / 100).toLocaleString()}`, subtext: "From all campaigns", icon: TrendingUp, color: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Campaigns</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your marketing campaigns.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-400 mt-1">{stat.subtext}</p>
              </div>
              <div className={cn("p-2.5 rounded-lg", stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">All Campaigns</h3>
            <p className="text-sm text-slate-500">Manage your marketing campaigns</p>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
            + New Campaign
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider py-3 pr-4">Campaign</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider py-3 pr-4">Status</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider py-3 pr-4">Type</th>
                <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider py-3 pr-4">Sent</th>
                <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider py-3 pr-4">Opened</th>
                <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider py-3 pr-4">Clicked</th>
                <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider py-3 pr-4">Converted</th>
                <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider py-3 pr-4">Revenue</th>
                <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => {
                const Icon = typeIcons[campaign.type] || Mail;
                const openRate = campaign.sent > 0 ? ((campaign.opened / campaign.sent) * 100).toFixed(1) : "0";
                const clickRate = campaign.sent > 0 ? ((campaign.clicked / campaign.sent) * 100).toFixed(1) : "0";
                const convRate = campaign.sent > 0 ? ((campaign.converted / campaign.sent) * 100).toFixed(1) : "0";

                return (
                  <tr key={campaign.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                          <Icon className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{campaign.name}</p>
                          <p className="text-xs text-slate-500">
                            {campaign.startDate?.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} - {campaign.endDate?.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium border", statusStyles[campaign.status])}>
                        {campaign.status}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 text-sm text-slate-600">{campaign.type}</td>
                    <td className="py-3.5 pr-4 text-right text-sm font-medium text-slate-900">{campaign.sent.toLocaleString()}</td>
                    <td className="py-3.5 pr-4 text-right">
                      <div>
                        <span className="text-sm font-medium text-slate-900">{campaign.opened.toLocaleString()}</span>
                        <span className="text-xs text-slate-500 ml-1">({openRate}%)</span>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4 text-right">
                      <div>
                        <span className="text-sm font-medium text-slate-900">{campaign.clicked.toLocaleString()}</span>
                        <span className="text-xs text-slate-500 ml-1">({clickRate}%)</span>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4 text-right">
                      <div>
                        <span className="text-sm font-medium text-slate-900">{campaign.converted.toLocaleString()}</span>
                        <span className="text-xs text-slate-500 ml-1">({convRate}%)</span>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4 text-right text-sm font-semibold text-slate-900">${(campaign.revenue / 100).toLocaleString()}</td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 transition-colors">
                          {campaign.status === "Active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Campaign Performance</h3>
          <div className="space-y-4">
            {campaigns.filter(c => c.status !== "Draft").map((campaign) => {
              const openRate = campaign.sent > 0 ? (campaign.opened / campaign.sent) * 100 : 0;
              return (
                <div key={campaign.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-slate-700">{campaign.name}</span>
                    <span className="text-sm text-slate-500">{openRate.toFixed(1)}% open rate</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min(openRate, 100)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Revenue by Campaign</h3>
          <div className="space-y-4">
            {campaigns.filter(c => c.status !== "Draft").map((campaign) => {
              const revenue = campaign.revenue;
              const maxRev = 250000;
              return (
                <div key={campaign.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-slate-700">{campaign.name}</span>
                    <span className="text-sm font-semibold text-slate-900">${(revenue / 100).toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min((revenue / maxRev) * 100, 100)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
