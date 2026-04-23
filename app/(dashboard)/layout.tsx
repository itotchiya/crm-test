import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { prisma } from "@/lib/prisma";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const dbUser = await prisma.user.findUnique({ where: { id: session.user.id }, select: { name: true, email: true, role: true } });

  return (
    <div className="flex h-screen">
      <Sidebar user={{ name: dbUser?.name || session.user.name, email: dbUser?.email || session.user.email, role: dbUser?.role || "User" }} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-950 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
