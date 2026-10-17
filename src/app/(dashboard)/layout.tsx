import Image from "next/image";
import { AlertTriangle } from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { DashboardNavLink } from "@/components/layout/dashboard-nav-link";
import { MobileDashboardNav } from "@/components/layout/mobile-dashboard-nav";
import { prisma } from "@/lib/prisma";
import type { ReactNode } from "react";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      isActive: true,
    },
  });

  if (!currentUser || !currentUser.isActive) {
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
      { label: "Departments", href: "/departments", icon: "departments" as const },
      { label: "Workers", href: "/workers", icon: "workers" as const },
      { label: "Leaders", href: "/leaders", icon: "leaders" as const },
      { label: "Attendance", href: "/attendance", icon: "attendance" as const },
      { label: "Approvals", href: "/approvals", icon: "approvals" as const },
      { label: "Activity", href: "/activity", icon: "activity" as const },
      { label: "Members", href: "/members", icon: "members" as const },
    ]
    : [
      { label: "Dashboard", href: "/dashboard", icon: "dashboard" as const },
      { label: "My Departments", href: "/my-department", icon: "departments" as const },
      { label: "Workers", href: "/workers", icon: "workers" as const },
      { label: "Approvals", href: "/approvals", icon: "approvals" as const },
      { label: "Attendance", href: "/attendance", icon: "attendance" as const },
      { label: "Activity", href: "/activity", icon: "activity" as const },
    ];

  const blockedContent = (
    <main className="flex min-h-[calc(100vh-5rem)] items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-xl rounded-3xl border border-amber-500/20 bg-card p-6 text-center shadow-sm sm:p-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <AlertTriangle size={28} />
        </div>

        <h1 className="mt-5 text-2xl font-bold text-card-foreground">
          Department Access Disabled
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          One or more departments assigned to your leadership account is no
          longer active. Please contact the administrator for access.
        </p>

        {inactiveLeaderDepartments.length > 0 && (
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {inactiveLeaderDepartments.map((department) => (
              <span
                key={department.id}
                className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-600 dark:text-amber-400"
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
    <div className="min-h-screen bg-background">
      <MobileDashboardNav
        navItems={navItems}
        userName={session.user.name}
        roleLabel={isAdmin ? "Administrator" : "Department Leader"}
        disabled={Boolean(isLeaderDepartmentInactive)}
      />

      <aside className="fixed inset-y-0 left-0 hidden w-72 flex-col bg-foreground text-primary-foreground lg:flex">
        <div className="shrink-0 px-6 py-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-foreground/10">
            <Image
              src="/logo.png"
              alt="GIC Egbelu Workforce"
              width={120}
              height={120}
              loading="eager"
              priority
            />
          </div>

          <h1 className="mt-4 text-xl font-bold">GIC Egbelu</h1>
          <p className="text-sm text-primary-foreground/70">Workforce System</p>
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

        <div className="shrink-0 border-t border-primary-foreground/10 p-4">
          <div className="rounded-2xl bg-primary-foreground/10 p-4">
            <p className="truncate text-sm font-semibold text-primary-foreground">
              {session.user.name}
            </p>
            <p className="mt-1 truncate text-xs text-primary-foreground/70">
              {isAdmin ? "Administrator" : "Department Leader"}
            </p>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="hidden h-20 items-center justify-between border-b border-border bg-card px-8 lg:flex">
          <div>
            <p className="text-sm text-muted-foreground">Welcome back</p>
            <h2 className="text-xl font-bold text-card-foreground">
              Workforce Dashboard
            </h2>
          </div>

          <div className="text-right">
            <p className="text-sm font-semibold text-card-foreground">
              {session.user.name}
            </p>
            <p className="text-xs text-muted-foreground">
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