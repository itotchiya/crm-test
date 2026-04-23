import { CheckCircle, Phone, Mail, Calendar, FileText, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  time: string;
  icon: string;
}

const iconMap: Record<string, React.ElementType> = {
  CheckCircle,
  Phone,
  Mail,
  Calendar,
  FileText,
  PlusCircle,
};

const colorMap: Record<string, string> = {
  deal: "bg-emerald-50 text-emerald-600",
  call: "bg-blue-50 text-blue-600",
  email: "bg-amber-50 text-amber-600",
  meeting: "bg-purple-50 text-purple-600",
  note: "bg-slate-50 text-slate-600",
};

export default function ActivityFeed({ activities }: { activities: Activity[] }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-slate-900">Recent Activity</h3>
        <p className="text-sm text-slate-500">Latest updates and actions</p>
      </div>
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = iconMap[activity.icon] || FileText;
          const colorClass = colorMap[activity.type] || "bg-slate-50 text-slate-600";
          return (
            <div key={activity.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={cn("w-9 h-9 rounded-full flex items-center justify-center shrink-0", colorClass)}>
                  <Icon className="w-4 h-4" />
                </div>
                {index !== activities.length - 1 && (
                  <div className="w-px h-full bg-slate-100 my-1"></div>
                )}
              </div>
              <div className="pb-4">
                <p className="text-sm font-medium text-slate-900">{activity.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{activity.description}</p>
                <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
