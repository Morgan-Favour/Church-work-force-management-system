import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Building2, Users, UserRoundCheck } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { QuickActionsCard } from "@/components/dashboard/quick-actions-card";
import { RecentActivityCard } from "@/components/dashboard/recent-activity-card";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const isAdmin = session.user.role === "ADMIN";

  const recentActivities = await prisma.activityLog.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  if (!isAdmin) {
    const department = session.user.departmentId
      ? await prisma.department.findUnique({
          where: {
            id: session.user.departmentId,
          },
        })
      : null;

    const departmentWorkerCount = await prisma.worker.count({
      where: {
        departments: {
          some: {
            departmentId: session.user.departmentId || "",
          },
        },
      },
    });

    return (
      <div className="space-y-6">
        <PageHeader
          label="Department Leader"
          title={`Welcome, ${session.user.name}`}
          description={`You are managing ${
            department?.name || "your department"
          }.`}
        />

        <section className="grid gap-4 sm:grid-cols-2">
          <StatCard
            label="My Department"
            value={department?.name || "Not assigned"}
            icon={Building2}
            href={department?.id ? `/departments/${department.id}` : "/dashboard"}
          />

          <StatCard
            label="Department Workers"
            value={departmentWorkerCount}
            icon={Users}
            href="/workers"
          />
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <RecentActivityCard activities={recentActivities} />

          <QuickActionsCard
            actions={[
              {
                label: "View Workers",
                href: "/workers",
                primary: true,
              },
              {
                label: "Mark Attendance",
                href: "/attendance",
              },
            ]}
          />
        </section>
      </div>
    );
  }

  const departmentCount = await prisma.department.count();
  const workerCount = await prisma.worker.count();
  const leaderCount = await prisma.user.count({
    where: {
      role: "DEPARTMENT_LEADER",
    },
  });

  const departments = await prisma.department.findMany({
    include: {
      attendance: true,
    },
  });

  const workers = await prisma.worker.findMany({
    include: {
      attendance: true,
    },
  });

  const departmentAnalytics = departments.map((department) => {
    const total = department.attendance.length;

    const positive = department.attendance.filter(
      (attendance) =>
        attendance.status === "PRESENT" || attendance.status === "LATE"
    ).length;

    return {
      id: department.id,
      name: department.name,
      rate: total > 0 ? Math.round((positive / total) * 100) : 0,
    };
  });

  const workerAnalytics = workers.map((worker) => {
    const total = worker.attendance.length;

    const positive = worker.attendance.filter(
      (attendance) =>
        attendance.status === "PRESENT" || attendance.status === "LATE"
    ).length;

    return {
      id: worker.id,
      name: worker.fullName,
      rate: total > 0 ? Math.round((positive / total) * 100) : 0,
    };
  });

  const bestDepartment = departmentAnalytics.sort((a, b) => b.rate - a.rate)[0];
  const topWorker = workerAnalytics.sort((a, b) => b.rate - a.rate)[0];

  return (
    <div className="space-y-6">
      <PageHeader
        label="GIC Egbelu Workforce"
        title="Workforce Dashboard"
        description="Manage departments, workers, leaders, attendance, and accountability from one place."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Total Workers"
          value={workerCount}
          icon={Users}
          href="/workers"
        />

        <StatCard
          label="Departments"
          value={departmentCount}
          icon={Building2}
          href="/departments"
        />

        <StatCard
          label="Leaders"
          value={leaderCount}
          icon={UserRoundCheck}
          href="/leaders"
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <StatCard
          label="Best Performing Department"
          value={bestDepartment?.name || "N/A"}
          helper={`Attendance Rate: ${bestDepartment?.rate || 0}%`}
          icon={Building2}
          href={bestDepartment?.id ? `/departments/${bestDepartment.id}` : "/departments"}
        />

        <StatCard
          label="Most Active Worker"
          value={topWorker?.name || "N/A"}
          helper={`Attendance Rate: ${topWorker?.rate || 0}%`}
          icon={Users}
          href={topWorker?.id ? `/workers/${topWorker.id}` : "/workers"}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <RecentActivityCard activities={recentActivities} />

        <QuickActionsCard
          actions={[
            {
              label: "Add Department",
              href: "/departments",
              primary: true,
            },
            {
              label: "Add Worker",
              href: "/workers",
            },
            {
              label: "Mark Attendance",
              href: "/attendance",
            },
          ]}
        />
      </section>
    </div>
  );
}