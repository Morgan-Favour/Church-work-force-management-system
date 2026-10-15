import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Building2, Users } from "lucide-react";



export default async function MyDepartmentsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== UserRole.DEPARTMENT_LEADER) {
    redirect("/dashboard");
  }

  const departmentIds = session.user.departmentIds || [];

  const departments = await prisma.department.findMany({
    where: {
      id: {
        in: departmentIds,
      },
      isActive: true,
    },
    include: {
      workers: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Departments I Lead"
        description="View all departments assigned to your leadership account."
      />

      {departments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center shadow-sm">
          <p className="font-semibold text-card-foreground">
            No active department assigned
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Please contact the administrator if this is incorrect.
          </p>
        </div>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {departments.map((department) => (
            <div
              key={department.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                <Building2 size={22} />
              </div>

              <h2 className="mt-5 text-lg font-bold text-card-foreground">
                {department.name}
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                {department.description || "No description provided"}
              </p>

              <div className="mt-5">
                <StatCard
                  label="Workers"
                  value={department.workers.length}
                  icon={Users}
                  href="/workers"
                />
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}