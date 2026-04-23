"use client";

import { useState, useEffect } from "react";
import { Plus, Search, MoreHorizontal, Mail, TrendingUp, Users, MousePointer, Pencil, Trash2, Pause, Play, MailCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/modal";
import { toast } from "sonner";

interface Campaign {
  id: string;
  name: string;
  type: string;
  status: string;
  audience: string;
  sent: number;
  opened: number;
  clicked: number;
  startDate: string;
  endDate: string;
}

const statusColors: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
  Draft: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  Completed: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
  Paused: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", type: "Email", status: "Draft", audience: "", startDate: "", endDate: "" });

  useEffect(() => {
    fetch("/api/campaigns").then(r => r.json()).then(data => { setCampaigns(data); setLoading(false); });
  }, []);

  const filtered = campaigns.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newCampaign: Campaign = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      type: formData.type,
      status: formData.status,
      audience: formData.audience,
      sent: 0,
      opened: 0,
      clicked: 0,
      startDate: formData.startDate,
      endDate: formData.endDate,
    };
    setCampaigns([newCampaign, ...campaigns]);
    setIsAddOpen(false);
    setFormData({ name: "", type: "Email", status: "Draft", audience: "", startDate: "", endDate: "" });
    toast.success("Campaign created!");
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    setCampaigns(campaigns.map(c => c.id === editId ? { ...c, ...formData } : c));
    setIsEditOpen(false);
    setEditId(null);
    toast.success("Campaign updated!");
  };

  const handleDelete = (id: string) => {
    setCampaigns(campaigns.filter(c => c.id !== id));
    setOpenMenu(null);
    toast.success("Campaign deleted!");
  };

  const toggleStatus = (id: string) => {
    setCampaigns(campaigns.map(c => c.id === id ? { ...c, status: c.status === "Active" ? "Paused" : "Active" } : c));
    setOpenMenu(null);
    toast.success("Status updated!");
  };

  const startEdit = (campaign: Campaign) => {
    setEditId(campaign.id);
    setFormData({ name: campaign.name, type: campaign.type, status: campaign.status, audience: campaign.audience, startDate: campaign.startDate, endDate: campaign.endDate });
    setIsEditOpen(true);
    setOpenMenu(null);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Campaigns</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Create and manage marketing campaigns.</p>
        </div>
        <button onClick={() => setIsAddOpen(true)} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> New Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[{ label: "Total Campaigns", value: campaigns.length, icon: Mail, color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
          { label: "Active", value: campaigns.filter(c => c.status === "Active").length, icon: MailCheck, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
          { label: "Avg Open Rate", value: "42%", icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
          { label: "Total Audience", value: campaigns.reduce((a, c) => a + Number(c.audience || 0), 0).toLocaleString(), icon: Users, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20" }].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p>
              </div>
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", stat.bg)}>
                <stat.icon className={cn("w-5 h-5", stat.color)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search campaigns..." className="pl-9 pr-4 py-2 w-full border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">Campaign</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">Audience</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">Performance</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">Date Range</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {filtered.map(campaign => (
                <tr key={campaign.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                        <Mail className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{campaign.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{campaign.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border", statusColors[campaign.status])}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">{campaign.audience}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-slate-400" />{campaign.sent}</span>
                      <span className="flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5 text-emerald-500" />{campaign.opened}</span>
                      <span className="flex items-center gap-1"><MousePointer className="w-3.5 h-3.5 text-blue-500" />{campaign.clicked}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">{campaign.startDate} - {campaign.endDate}</td>
                  <td className="px-5 py-4 relative">
                    <button onClick={() => setOpenMenu(openMenu === campaign.id ? null : campaign.id)} className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    {openMenu === campaign.id && (
                      <div className="absolute right-0 top-10 w-36 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-10 overflow-hidden">
                        <button onClick={() => startEdit(campaign)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"><Pencil className="w-3.5 h-3.5" />Edit</button>
                        <button onClick={() => toggleStatus(campaign.id)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">{campaign.status === "Active" ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}{campaign.status === "Active" ? "Pause" : "Activate"}</button>
                        <button onClick={() => handleDelete(campaign.id)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20"><Trash2 className="w-3.5 h-3.5" />Delete</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-400 dark:text-slate-500 text-sm">No campaigns found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="New Campaign">
        <form onSubmit={handleAdd} className="space-y-4">
          <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label><input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label><select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"><option>Email</option><option>SMS</option><option>Social</option></select></div>
            <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label><select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"><option>Draft</option><option>Active</option></select></div>
          </div>
          <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Audience Size</label><input type="number" value={formData.audience} onChange={e => setFormData({...formData, audience: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Date</label><input type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100" /></div>
            <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End Date</label><input type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100" /></div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">Create Campaign</button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Campaign">
        <form onSubmit={handleEdit} className="space-y-4">
          <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label><input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label><select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"><option>Email</option><option>SMS</option><option>Social</option></select></div>
            <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label><select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"><option>Draft</option><option>Active</option><option>Paused</option><option>Completed</option></select></div>
          </div>
          <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Audience Size</label><input type="number" value={formData.audience} onChange={e => setFormData({...formData, audience: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Date</label><input type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100" /></div>
            <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End Date</label><input type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100" /></div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={() => setIsEditOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">Save Changes</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
