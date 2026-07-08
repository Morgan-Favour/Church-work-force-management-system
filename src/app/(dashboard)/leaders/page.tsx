import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { authOptions } from "@/lib/auth";
import { LeaderForm } from "@/components/leaders/leader-form";
import { LeaderList } from "@/components/leaders/leader-list";
import { Pagination } from "@/components/ui/pagination";

const PAGE_SIZE = 10;

export default async function LeadersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;

  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const currentPage = Number(params.page || "1");
  const page = Number.isNaN(currentPage) || currentPage < 1 ? 1 : currentPage;
  const skip = (page - 1) * PAGE_SIZE;

  const departments = await prisma.department.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  const [leaders, totalLeaders] = await Promise.all([
    prisma.user.findMany({
      where: {
        role: UserRole.DEPARTMENT_LEADER,
      },
      include: {
        leaderDepartments: {
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

    prisma.user.count({
      where: {
        role: UserRole.DEPARTMENT_LEADER,
      },
    }),
  ]);

  const totalPages = Math.ceil(totalLeaders / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <PageHeader
        label="Leaders"
        title="Manage Church Leaders"
        description="Create login accounts for department leaders and automatically add them as workers."
      />

      <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <LeaderForm departments={departments} />

        <div>
          <LeaderList leaders={leaders} />

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath="/leaders"
          />
        </div>
      </section>
    </div>
  );
}