import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { WorkerForm } from "@/components/workers/worker-form";
import { WorkerList } from "@/components/workers/worker-list";
import { Pagination } from "@/components/ui/pagination";
import { WorkersPageActions } from "@/components/workers/workers-page-actions";

const PAGE_SIZE = 10;

export default async function WorkersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;

  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  const isAdmin = session.user.role === UserRole.ADMIN;
  const leaderDepartmentIds = session.user.departmentIds || [];

  const currentPage = Number(params.page || "1");
  const page = Number.isNaN(currentPage) || currentPage < 1 ? 1 : currentPage;
  const skip = (page - 1) * PAGE_SIZE;

  const departments = await prisma.department.findMany({
    where: isAdmin
      ? { isActive: true }
      : {
        id: { in: leaderDepartmentIds },
        isActive: true,
      },
    orderBy: { name: "asc" },
  });

  const workerWhere = isAdmin
    ? {}
    : {
      departments: {
        some: {
          departmentId: {
            in: leaderDepartmentIds,
          },
        },
      },
    };

  const [workers, totalWorkers] = await Promise.all([
    prisma.worker.findMany({
      where: workerWhere,
      include: {
        departments: {
          include: {
            department: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: PAGE_SIZE,
    }),

    prisma.worker.count({
      where: workerWhere,
    }),
  ]);

  const totalPages = Math.ceil(totalWorkers / PAGE_SIZE);

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

        <WorkersPageActions
          departments={departments}
        />

        <WorkerList
          workers={workers}
          isAdmin={isAdmin}
          visibleDepartmentIds={
            isAdmin ? undefined : leaderDepartmentIds
          }
        />

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          basePath="/workers"
        />

      </section>
    </div>
  );
}