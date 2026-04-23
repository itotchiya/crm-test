export interface DashboardKPI {
  title: string;
  value: string;
  change: string;
  period: string;
  trend: "up" | "down";
}

export interface RevenueData {
  month: string;
  revenue: number;
  target: number;
}

export interface PipelineData {
  stage: string;
  deals: number;
  value: number;
}

export interface RecentDeal {
  id: string;
  company: string;
  contact: string;
  value: string;
  stage: string;
  probability: number;
  date: string;
  avatar: string;
}

export interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  time: string;
  icon: string;
}

export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: string;
  revenue: string;
  lastContact: string;
  avatar: string;
}

export interface LeadSource {
  name: string;
  value: number;
  color: string;
}

export interface TaskItem {
  id: string;
  title: string;
  priority: string;
  due: string;
  completed: boolean;
}

export interface KanbanDeal {
  id: string;
  title: string;
  company: string;
  contact: string;
  value: string;
  probability: number;
  daysInStage: number;
  avatar: string;
  color: string;
  stage: string;
}

export interface CalendarEventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  type: string;
  with: string;
  company: string;
}

export interface Campaign {
  id: string;
  name: string;
  status: string;
  type: string;
  sent: number;
  opened: number;
  clicked: number;
  converted: number;
  revenue: string;
  startDate: string;
  endDate: string;
}

export interface MonthlyPerformance {
  month: string;
  deals: number;
  revenue: number;
  customers: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  deals: number;
  revenue: number;
  conversion: number;
  target: number;
}
