"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { User, Building2, Bell, Plug, Shield, Palette, Save } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "company", label: "Company", icon: Building2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "integrations", label: "Integrations", icon: Plug },
  { id: "security", label: "Security", icon: Shield },
  { id: "appearance", label: "Appearance", icon: Palette },
];

const integrations = [
  { name: "Slack", description: "Get deal notifications in Slack", connected: true, icon: "SL" },
  { name: "Zapier", description: "Automate workflows with Zapier", connected: true, icon: "ZP" },
  { name: "Google Calendar", description: "Sync meetings and events", connected: true, icon: "GC" },
  { name: "Mailchimp", description: "Email marketing integration", connected: false, icon: "MC" },
  { name: "HubSpot", description: "Two-way contact sync", connected: false, icon: "HS" },
  { name: "Stripe", description: "Payment and invoicing", connected: false, icon: "ST" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const { data: session } = useSession();

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Configure your account and preferences.</p>
      </div>

      <div className="max-w-5xl">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-64 shrink-0">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <nav className="p-2 space-y-0.5">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                        isActive
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      )}
                    >
                      <Icon className="w-4.5 h-4.5" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            {activeTab === "profile" && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
                <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                    {session?.user?.name?.split(" ").map((n) => n[0]).join("") || "U"}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{session?.user?.name || "User"}</h3>
                    <p className="text-sm text-slate-500">{session?.user?.role || "User"} at Nexus CRM</p>
                    <p className="text-sm text-slate-400">{session?.user?.email || ""}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">First Name</label>
                    <input className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" defaultValue={session?.user?.name?.split(" ")[0] || ""} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Last Name</label>
                    <input className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" defaultValue={session?.user?.name?.split(" ")[1] || ""} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Email</label>
                    <input className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" defaultValue={session?.user?.email || ""} type="email" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Phone</label>
                    <input className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" defaultValue="+1 (555) 123-4567" />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-medium text-slate-700">Job Title</label>
                    <input className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" defaultValue="Sales Manager" />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-medium text-slate-700">Bio</label>
                    <textarea
                      className="w-full min-h-[100px] rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      defaultValue="Experienced sales professional with 8+ years in B2B SaaS sales. Passionate about building relationships and closing deals."
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2">
                    <Save className="w-4 h-4" /> Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === "company" && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
                <h3 className="text-lg font-semibold text-slate-900 pb-4 border-b border-slate-100">Company Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Company Name</label>
                    <input className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" defaultValue="Nexus Solutions Inc" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Website</label>
                    <input className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" defaultValue="https://nexuscrm.io" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Industry</label>
                    <input className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" defaultValue="Software / SaaS" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Company Size</label>
                    <input className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" defaultValue="50-200 employees" />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-medium text-slate-700">Address</label>
                    <input className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" defaultValue="123 Innovation Drive, San Francisco, CA 94105" />
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2">
                    <Save className="w-4 h-4" /> Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
                <h3 className="text-lg font-semibold text-slate-900 pb-4 border-b border-slate-100">Notification Preferences</h3>
                {[
                  { label: "Deal Won", description: "Notify when a deal is marked as won", checked: true },
                  { label: "Deal Lost", description: "Notify when a deal is marked as lost", checked: true },
                  { label: "New Lead Assigned", description: "Notify when a new lead is assigned to you", checked: true },
                  { label: "Task Due", description: "Notify when a task is due soon", checked: false },
                  { label: "Meeting Reminders", description: "Remind 15 minutes before meetings", checked: true },
                  { label: "Weekly Report", description: "Receive weekly performance summary", checked: true },
                  { label: "Mentions", description: "Notify when someone mentions you", checked: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{item.label}</p>
                      <p className="text-xs text-slate-500">{item.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={item.checked} className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                ))}
                <div className="flex justify-end pt-4">
                  <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2">
                    <Save className="w-4 h-4" /> Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === "integrations" && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 pb-4 border-b border-slate-100">Connected Integrations</h3>
                <div className="space-y-3 mt-4">
                  {integrations.map((integration) => (
                    <div key={integration.name} className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-indigo-200 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-sm font-semibold text-slate-700">
                          {integration.icon}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{integration.name}</p>
                          <p className="text-xs text-slate-500">{integration.description}</p>
                        </div>
                      </div>
                      <button
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                          integration.connected
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-300"
                        )}
                      >
                        {integration.connected ? "Connected" : "Connect"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
                <h3 className="text-lg font-semibold text-slate-900 pb-4 border-b border-slate-100">Security Settings</h3>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Current Password</label>
                    <input type="password" defaultValue="********" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">New Password</label>
                    <input type="password" placeholder="Enter new password" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Confirm New Password</label>
                    <input type="password" placeholder="Confirm new password" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-900">Two-Factor Authentication</p>
                      <p className="text-xs text-slate-500">Add an extra layer of security</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-900">Login Notifications</p>
                      <p className="text-xs text-slate-500">Get notified of new logins</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2">
                    <Save className="w-4 h-4" /> Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === "appearance" && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
                <h3 className="text-lg font-semibold text-slate-900 pb-4 border-b border-slate-100">Appearance</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-slate-900 mb-3">Theme</p>
                    <div className="flex gap-3">
                      <button className="flex-1 p-4 rounded-xl border-2 border-indigo-500 bg-slate-50 text-center">
                        <div className="w-full h-12 bg-white rounded-lg border border-slate-200 mb-2 shadow-sm" />
                        <p className="text-sm font-medium text-slate-900">Light</p>
                      </button>
                      <button className="flex-1 p-4 rounded-xl border-2 border-transparent hover:border-slate-300 bg-slate-900 text-center">
                        <div className="w-full h-12 bg-slate-800 rounded-lg border border-slate-700 mb-2" />
                        <p className="text-sm font-medium text-white">Dark</p>
                      </button>
                      <button className="flex-1 p-4 rounded-xl border-2 border-transparent hover:border-slate-300 bg-slate-50 text-center">
                        <div className="w-full h-12 bg-gradient-to-b from-white to-slate-900 rounded-lg border border-slate-200 mb-2" />
                        <p className="text-sm font-medium text-slate-900">System</p>
                      </button>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-sm font-medium text-slate-900 mb-3">Sidebar Density</p>
                    <div className="flex gap-3">
                      <button className="px-4 py-2 rounded-lg border border-indigo-500 bg-indigo-50 text-sm font-medium text-indigo-700">
                        Compact
                      </button>
                      <button className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:border-slate-300">
                        Default
                      </button>
                      <button className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:border-slate-300">
                        Comfortable
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2">
                    <Save className="w-4 h-4" /> Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
