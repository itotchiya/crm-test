"use client";

import { useState } from "react";
import { MoreHorizontal, ArrowUpDown, Mail, Phone, Pencil, Trash2, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/modal";
import { createContact, updateContact, deleteContact } from "@/lib/actions";
import { toast } from "sonner";
import { motion } from "framer-motion";

const statusStyles: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
  Inactive: "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
  Prospect: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
};

interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string | null;
  status: string;
  revenue: number;
  lastContact: Date | null;
  avatar: string | null;
}

export default function CustomersTable({ customers }: { customers: Customer[] }) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [localCustomers, setLocalCustomers] = useState(customers);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", company: "", status: "Active" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newContact = await createContact(formData);
      setLocalCustomers([newContact as unknown as Customer, ...localCustomers]);
      setFormData({ name: "", email: "", phone: "", company: "", status: "Active" });
      setIsAddOpen(false);
      toast.success("Customer added successfully!");
    } catch (error) {
      toast.error("Failed to add customer");
    }
    setIsSubmitting(false);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    setIsSubmitting(true);
    try {
      await updateContact(selectedCustomer.id, formData);
      setLocalCustomers(localCustomers.map(c => c.id === selectedCustomer.id ? { ...c, ...formData } as Customer : c));
      setIsEditOpen(false);
      toast.success("Customer updated!");
    } catch (error) {
      toast.error("Failed to update customer");
    }
    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    if (!selectedCustomer) return;
    try {
      await deleteContact(selectedCustomer.id);
      setLocalCustomers(localCustomers.filter(c => c.id !== selectedCustomer.id));
      setIsDeleteOpen(false);
      toast.success("Customer deleted!");
    } catch (error) {
      toast.error("Failed to delete customer");
    }
  };

  const openEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone || "",
      company: customer.company,
      status: customer.status,
    });
    setIsEditOpen(true);
  };

  const openDelete = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDeleteOpen(true);
  };

  const handleExport = () => {
    const csv = [
      ["Name", "Company", "Email", "Phone", "Status", "Revenue", "Last Contact"].join(","),
      ...localCustomers.map(c => [
        c.name, c.company, c.email, c.phone || "", c.status, `$${(c.revenue / 100).toLocaleString()}`,
        c.lastContact ? new Date(c.lastContact).toLocaleDateString() : "Never"
      ].join(","))
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "customers.csv";
    a.click();
    toast.success("Customers exported!");
  };

  const formFields = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
        <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
          <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone</label>
          <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company</label>
          <input required value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
          <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Prospect">Prospect</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">All Customers</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage your contacts and leads</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExport}
            className="px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5">
            <Download className="w-4 h-4" /> Export
          </button>
          <button onClick={() => { setFormData({ name: "", email: "", phone: "", company: "", status: "Active" }); setIsAddOpen(true); }}
            className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
            Add Customer
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
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
            {localCustomers.map((customer, i) => (
              <motion.tr key={customer.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="py-3.5 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 flex items-center justify-center text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                      {customer.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{customer.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{customer.company}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 pr-4">
                  <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium border", statusStyles[customer.status])}>
                    {customer.status}
                  </span>
                </td>
                <td className="py-3.5 pr-4 text-sm font-semibold text-slate-900 dark:text-slate-100">${(customer.revenue / 100).toLocaleString()}</td>
                <td className="py-3.5 pr-4">
                  <div className="flex items-center gap-2">
                    <a href={`mailto:${customer.email}`} className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
                      <Mail className="w-4 h-4" />
                    </a>
                    {customer.phone && (
                      <a href={`tel:${customer.phone}`} className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
                        <Phone className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </td>
                <td className="py-3.5 pr-4 text-sm text-slate-500 dark:text-slate-400">
                  {customer.lastContact ? new Date(customer.lastContact).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Never"}
                </td>
                <td className="py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => openEdit(customer)} className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600 transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => openDelete(customer)} className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
        <p className="text-sm text-slate-500 dark:text-slate-400">Showing {localCustomers.length} customers</p>
      </div>

      {/* Add Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Customer">
        <form onSubmit={handleAdd}>
          {formFields}
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50">{isSubmitting ? "Adding..." : "Add Customer"}</button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Customer">
        <form onSubmit={handleEdit}>
          {formFields}
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={() => setIsEditOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50">{isSubmitting ? "Saving..." : "Save Changes"}</button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Delete Customer">
        <p className="text-sm text-slate-600 dark:text-slate-400">Are you sure you want to delete <strong className="text-slate-900 dark:text-white">{selectedCustomer?.name}</strong>? This action cannot be undone.</p>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setIsDeleteOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">Cancel</button>
          <button onClick={handleDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700">Delete</button>
        </div>
      </Modal>
    </div>
  );
}
