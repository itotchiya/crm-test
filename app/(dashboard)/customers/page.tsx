import CustomersTable from "@/components/customers/CustomersTable";

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
        <p className="text-sm text-slate-500 mt-1">Manage and view all your customer relationships.</p>
      </div>
      <CustomersTable />
    </div>
  );
}
