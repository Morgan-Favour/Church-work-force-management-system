import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { WorkerList } from "@/components/workers/worker-list";
import { WorkersPageActions } from "@/components/workers/workers-page-actions";

 

export default async function WorkersPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  const isAdmin = session.user.role === UserRole.ADMIN;
  const leaderDepartmentIds = session.user.departmentIds || [];

  // Departments for the form / actions
  const departments = await prisma.department.findMany({
    where: isAdmin
      ? { isActive: true }
      : {
          id: { in: leaderDepartmentIds },
          isActive: true,
        },
    select: {
      id: true,
      name: true,
    },
    orderBy: { name: "asc" },
  });

  const workerWhere = isAdmin
    ? {}
    : {
        departments: {
          some: {
            departmentId: { in: leaderDepartmentIds },
          },
        },
      };

  // Fetch ALL workers (WorkerList will handle search + pagination)
  const workers = await prisma.worker.findMany({
    where: workerWhere,
    select: {
      id: true,
      fullName: true,
      phone: true,
      isActive: true,
      departments: {
        select: {
          id: true,
          department: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Church Workers"
        description={
          isAdmin
            ? "Add workers and assign them to one or more departments."
            : "Add and manage workers in the departments you lead."
        }
      />

      <section className="space-y-6">
        <WorkersPageActions departments={departments} />

        <WorkerList
          workers={workers}
          isAdmin={isAdmin}
          visibleDepartmentIds={isAdmin ? undefined : leaderDepartmentIds}
        />
      </section>
    </div>
  );
}