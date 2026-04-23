"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  BarChart3,
  Mail,
  Calendar,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Layers,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    avatar?: string | null;
    role?: string | null;
  };
}

const navItems = [
  { id: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "/customers", label: "Customers", icon: Users },
  { id: "/deals", label: "Deals", icon: Briefcase },
  { id: "/analytics", label: "Analytics", icon: BarChart3 },
  { id: "/campaigns", label: "Campaigns", icon: Mail },
  { id: "/calendar", label: "Calendar", icon: Calendar },
];

const bottomItems = [
  { id: "/settings", label: "Settings", icon: Settings },
  { id: "/help", label: "Help Center", icon: HelpCircle },
];

export default function Sidebar({ user }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "h-screen bg-slate-900 text-white flex flex-col transition-all duration-300 border-r border-slate-800",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <span className="font-semibold text-lg whitespace-nowrap">Nexus</span>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md hover:bg-slate-800 transition-colors shrink-0"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      <nav className="flex-1 py-4 space-y-1 px-3">
        {!collapsed && (
          <p className="px-3 text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
            Main Menu
          </p>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.id;
          return (
            <Link
              key={item.id}
              href={item.id}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="py-4 space-y-1 px-3 border-t border-slate-800">
        {!collapsed && (
          <p className="px-3 text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
            Support
          </p>
        )}
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.id;
          return (
            <Link
              key={item.id}
              href={item.id}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
            </Link>
          );
        })}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all duration-200"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="whitespace-nowrap">Logout</span>}
        </button>
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold shrink-0">
            {user.avatar || user.name?.split(" ").map((n) => n[0]).join("") || "U"}
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.role || "User"}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
