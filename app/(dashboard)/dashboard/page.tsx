import { prisma } from "@/lib/prisma";
import KpiCards from "@/components/dashboard/KpiCards";
import RevenueChart from "@/components/dashboard/RevenueChart";
import DealPipeline from "@/components/dashboard/DealPipeline";
import RecentDeals from "@/components/dashboard/RecentDeals";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import LeadSources from "@/components/dashboard/LeadSources";
import TasksWidget from "@/components/dashboard/TasksWidget";
import CustomersTable from "@/components/customers/CustomersTable";

export default async function DashboardPage() {
  const [
    contacts,
    deals,
    revenueMetrics,
    leadSources,
    activities,
    tasks,
    pipelineData,
  ] = await Promise.all([
    prisma.contact.count(),
    prisma.deal.findMany({
      include: { contact: true },
      orderBy: { updatedAt: "desc" },
      take: 6,
    }),
    prisma.revenueMetric.findMany({ orderBy: { id: "asc" } }),
    prisma.leadSource.findMany(),
    prisma.activity.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.task.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.deal.groupBy({
      by: ["stage"],
      _count: { id: true },
      _sum: { value: true },
    }),
  ]);

  const openDeals = await prisma.deal.count({
    where: {
      stage: { notIn: ["Closed_Won", "Closed_Lost"] },
    },
  });

  const totalRevenue = await prisma.deal.aggregate({
    where: { stage: "Closed_Won" },
    _sum: { value: true },
  });

  const kpis = [
    {
      title: "Total Revenue",
      value: `$${((totalRevenue._sum.value || 0) / 100).toLocaleString()}`,
      change: "+12.5%",
      period: "vs last month",
      trend: "up" as const,
    },
    {
      title: "Active Customers",
      value: contacts.toString(),
      change: "+8.2%",
      period: "vs last month",
      trend: "up" as const,
    },
    {
      title: "Open Deals",
      value: openDeals.toString(),
      change: "-3.1%",
      period: "vs last month",
      trend: "down" as const,
    },
    {
      title: "Conversion Rate",
      value: "24.8%",
      change: "+2.4%",
      period: "vs last month",
      trend: "up" as const,
    },
  ];

  const recentDealsData = deals.map((deal) => ({
    id: deal.id,
    company: deal.contact.company,
    contact: deal.contact.name,
    value: `$${(deal.value / 100).toLocaleString()}`,
    stage: deal.stage.replace("_", " "),
    probability: deal.probability,
    date: deal.updatedAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    avatar: deal.avatar || deal.contact.company.split(" ").map((w) => w[0]).join("").toUpperCase(),
  }));

  const recentCustomers = await prisma.contact.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      name: true,
      company: true,
      email: true,
      phone: true,
      status: true,
      revenue: true,
      lastContact: true,
      avatar: true,
    },
  });

  const pipeline = [
    { stage: "Lead", deals: 0, value: 0 },
    { stage: "Qualified", deals: 0, value: 0 },
    { stage: "Proposal", deals: 0, value: 0 },
    { stage: "Negotiation", deals: 0, value: 0 },
    { stage: "Closed Won", deals: 0, value: 0 },
  ];

  pipelineData.forEach((p) => {
    const stageName = p.stage.replace("_", " ");
    const item = pipeline.find((i) => i.stage === stageName);
    if (item) {
      item.deals = p._count.id;
      item.value = (p._sum.value || 0) / 100;
    }
  });

  const activitiesData = activities.map((a) => ({
    id: a.id,
    type: a.type,
    title: a.title,
    description: a.description || "",
    time: a.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    icon: a.icon,
  }));

  const tasksData = tasks.map((t) => ({
    id: t.id,
    title: t.title,
    priority: t.priority,
    due: t.due ? t.due.toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "No date",
    completed: t.completed,
  }));

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Welcome back, here&apos;s what&apos;s happening today.</p>
      </div>

      <KpiCards kpis={kpis} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={revenueMetrics} />
        </div>
        <div>
          <LeadSources data={leadSources} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentDeals deals={recentDealsData} />
        </div>
        <div>
          <ActivityFeed activities={activitiesData} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DealPipeline data={pipeline} />
        </div>
        <div>
          <TasksWidget tasks={tasksData} />
        </div>
      </div>

      <CustomersTable customers={recentCustomers} />
    </div>
  );
}
