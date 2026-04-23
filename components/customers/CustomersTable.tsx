import { prisma } from "@/lib/prisma";
import { MoreHorizontal, ArrowUpDown, Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Inactive: "bg-slate-50 text-slate-600 border-slate-200",
  Prospect: "bg-blue-50 text-blue-700 border-blue-200",
};

export default async function CustomersTable({ limit }: { limit?: number }) {
  const customers = await prisma.contact.findMany({
    orderBy: { createdAt: "desc" },
    take: limit || 100,
    include: { assigned: { select: { name: true } } },
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">All Customers</h3>
          <p className="text-sm text-slate-500">Manage your contacts and leads</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            Export
          </button>
          <button className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
            Add Customer
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider py-3 pr-4">
                <div className="flex items-center gap-1 cursor-pointer hover:text-slate-700">
                  Customer <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider py-3 pr-4">Status</th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider py-3 pr-4">Revenue</th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider py-3 pr-4">Contact</th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider py-3 pr-4">
                <div className="flex items-center gap-1 cursor-pointer hover:text-slate-700">
                  Last Contact <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="py-3.5 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-sm font-semibold text-indigo-700">
                      {customer.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{customer.name}</p>
                      <p className="text-xs text-slate-500">{customer.company}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 pr-4">
                  <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium border", statusStyles[customer.status])}>
                    {customer.status}
                  </span>
                </td>
                <td className="py-3.5 pr-4 text-sm font-semibold text-slate-900">${(customer.revenue / 100).toLocaleString()}</td>
                <td className="py-3.5 pr-4">
                  <div className="flex items-center gap-2">
                    <a href={`mailto:${customer.email}`} className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 transition-colors">
                      <Mail className="w-4 h-4" />
                    </a>
                    {customer.phone && (
                      <a href={`tel:${customer.phone}`} className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 transition-colors">
                        <Phone className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </td>
                <td className="py-3.5 pr-4 text-sm text-slate-500">
                  {customer.lastContact ? customer.lastContact.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Never"}
                </td>
                <td className="py-3.5 text-right">
                  <button className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
        <p className="text-sm text-slate-500">Showing {customers.length} customers</p>
        <div className="flex items-center gap-1">
          <button className="px-3 py-1.5 text-sm text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50" disabled>
            Previous
          </button>
          <button className="px-3 py-1.5 text-sm text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50" disabled>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
