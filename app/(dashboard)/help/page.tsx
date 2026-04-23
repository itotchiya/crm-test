import { HelpCircle } from "lucide-react";

export default function HelpPage() {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Help Center</h1>
        <p className="text-sm text-slate-500 mt-1">Get help and documentation.</p>
      </div>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6">
          <HelpCircle className="w-10 h-10 text-indigo-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Help Center</h2>
        <p className="text-slate-500 max-w-md">
          This section is under development. Check back soon for updates.
        </p>
      </div>
    </div>
  );
}
