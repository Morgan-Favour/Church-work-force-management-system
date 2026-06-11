import Link from "next/link";
import {
  LayoutDashboard,
  Building2,
  Users,
  UserCog,
  ClipboardCheck,
  BarChart3,
  Settings,
} from "lucide-react";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Departments", href: "/departments", icon: Building2 },
  { label: "Workers", href: "/workers", icon: Users },
  { label: "Leaders", href: "/leaders", icon: UserCog },
  { label: "Attendance", href: "/attendance", icon: ClipboardCheck },
  { label: "Reports", href: "/reports", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }
  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="w-72 shrink-0 bg-[#0e2d33] text-white">
        <div className="px-6 py-7">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-xl font-bold text-[#d4af37]">
            G
          </div>

          <h1 className="mt-4 text-xl font-bold">GIC Egbelu</h1>
          <p className="text-sm text-white/60">Workforce System</p>
        </div>

        <nav className="space-y-1 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/75 transition hover:bg-white/10 hover:text-white"
              >
                <Icon size={19} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8">
          <div>
            <p className="text-sm text-slate-500">Welcome back</p>
            <h2 className="text-xl font-bold text-slate-900">
              Workforce Dashboard
            </h2>
          </div>

          <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Logout
          </button>
        </header>

        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}