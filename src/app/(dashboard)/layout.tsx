import Image from "next/image";
import { AlertTriangle } from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { DashboardNavLink } from "@/components/layout/dashboard-nav-link";
import { MobileDashboardNav } from "@/components/layout/mobile-dashboard-nav";
import { prisma } from "@/lib/prisma";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const isAdmin = session.user.role === "ADMIN";

  const leaderDepartments =
    !isAdmin && session.user.departmentIds?.length
      ? await prisma.department.findMany({
        where: {
          id: {
            in: session.user.departmentIds,
          },
        },
        orderBy: {
          name: "asc",
        },
      })
      : [];

  const inactiveLeaderDepartments = leaderDepartments.filter(
    (department) => !department.isActive
  );

  const isLeaderDepartmentInactive =
    !isAdmin && inactiveLeaderDepartments.length > 0;

  const navItems = isAdmin
    ? [
      { label: "Dashboard", href: "/dashboard", icon: "dashboard" as const },
      {
        label: "Departments",
        href: "/departments",
        icon: "departments" as const,
      },
      { label: "Workers", href: "/workers", icon: "workers" as const },
      { label: "Leaders", href: "/leaders", icon: "leaders" as const },
      {
        label: "Attendance",
        href: "/attendance",
        icon: "attendance" as const,
      },
      { label: "Activity", href: "/activity", icon: "activity" as const },
    ]
    : [
      { label: "Dashboard", href: "/dashboard", icon: "dashboard" as const },
      {
        label: "My Departments",
        href: "/my-department",
        icon: "departments" as const,
      },
      { label: "Workers", href: "/workers", icon: "workers" as const },
      {
        label: "Attendance",
        href: "/attendance",
        icon: "attendance" as const,
      },
      { label: "Activity", href: "/activity", icon: "activity" as const },
    ];

  const blockedContent = (
    <main className="flex min-h-[calc(100vh-5rem)] items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-xl rounded-3xl border border-amber-200 bg-white p-6 text-center shadow-sm sm:p-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
          <AlertTriangle size={28} />
        </div>

        <h1 className="mt-5 text-2xl font-bold text-slate-900">
          Department Access Disabled
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          One or more departments assigned to your leadership account is no
          longer active. Please contact the administrator for access.
        </p>

        {inactiveLeaderDepartments.length > 0 && (
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {inactiveLeaderDepartments.map((department) => (
              <span
                key={department.id}
                className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700"
              >
                {department.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </main>
  );

  return (
    <div className="min-h-screen bg-slate-100">
      <MobileDashboardNav
        navItems={navItems}
        userName={session.user.name}
        roleLabel={isAdmin ? "Administrator" : "Department Leader"}
        disabled={Boolean(isLeaderDepartmentInactive)}
      />

      <aside className="fixed inset-y-0 left-0 hidden w-72 flex-col bg-[#0e2d33] text-white lg:flex">
        <div className="shrink-0 px-6 py-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
            <Image src="/logo.png" alt="Logo" width={44} height={44} />
          </div>

          <h1 className="mt-4 text-xl font-bold">GIC Egbelu</h1>
          <p className="text-sm text-white/60">Workforce System</p>
        </div>

        {!isLeaderDepartmentInactive && (
          <nav className="flex-1 space-y-1 overflow-y-auto px-4 pb-4">
            {navItems.map((item) => (
              <DashboardNavLink
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
              />
            ))}
          </nav>
        )}

        <div className="shrink-0 border-t border-white/10 p-4">
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="truncate text-sm font-semibold text-white">
              {session.user.name}
            </p>
            <p className="mt-1 truncate text-xs text-white/60">
              {isAdmin ? "Administrator" : "Department Leader"}
            </p>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="hidden h-20 items-center justify-between border-b border-slate-200 bg-white px-8 lg:flex">
          <div>
            <p className="text-sm text-slate-500">Welcome back</p>
            <h2 className="text-xl font-bold text-slate-900">
              Workforce Dashboard
            </h2>
          </div>

          <div className="text-right">
            <p className="text-sm font-semibold text-slate-900">
              {session.user.name}
            </p>
            <p className="text-xs text-slate-500">
              {isAdmin ? "Administrator" : "Department Leader"}
            </p>
          </div>
        </header>

        {isLeaderDepartmentInactive ? (
          blockedContent
        ) : (
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        )}
      </div>
    </div>
  );
}