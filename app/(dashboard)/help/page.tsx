"use client";

import { HelpCircle, Search, Book, MessageCircle, Mail, FileText } from "lucide-react";
import { useState } from "react";

const faqs = [
  { q: "How do I add a new customer?", a: "Go to the Customers page and click 'Add Customer' in the top right corner. Fill out the form with customer details and click Save." },
  { q: "How does the Kanban board work?", a: "Drag and drop deals between columns to update their stage. Click on any deal card to view its details." },
  { q: "Can I export data?", a: "Yes! On the Customers and other list pages, use the Export button to download data as a CSV file." },
  { q: "How do I change my password?", a: "Go to Settings > Security and enter your current password, then set a new one." },
  { q: "How do I create a campaign?", a: "Navigate to Campaigns and click 'New Campaign'. Fill in the details and set the status to Active when ready to launch." },
];

export default function HelpPage() {
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered = faqs.filter(f => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Help Center</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Find answers and get support.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <div className="max-w-xl mx-auto text-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">How can we help?</h2>
          <div className="relative mt-4">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search for help..." className="w-full pl-9 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[{ icon: Book, label: "Documentation", desc: "Read the full docs" }, { icon: MessageCircle, label: "Live Chat", desc: "Talk to our team" }, { icon: Mail, label: "Email Us", desc: "support@nexus.com" }].map(item => (
          <div key={item.label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                <item.icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.label}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-600" /> Frequently Asked Questions
        </h3>
        <div className="space-y-2">
          {filtered.map((faq, i) => (
            <div key={i} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
              <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                {faq.q}
                <span className="text-slate-400 text-lg transition-transform">{openIndex === i ? "−" : "+"}</span>
              </button>
              {openIndex === i && (
                <div className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">{faq.a}</div>
              )}
            </div>
          ))}
          {filtered.length === 0 && <p className="text-center text-sm text-slate-400 dark:text-slate-500 py-4">No results found.</p>}
        </div>
      </div>
    </div>
  );
}
