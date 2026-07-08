import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { PageHeader } from "@/components/ui/page-header";
import { DepartmentForm } from "@/components/departments/department-form";
import { DepartmentList } from "@/components/departments/department-list";
import { Pagination } from "@/components/ui/pagination";

const PAGE_SIZE = 10;

export const dynamic = 'force-dynamic'; // This ensures fresh data on every request

export default async function DepartmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;

  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const currentPage = Number(params.page || "1");
  const page = Number.isNaN(currentPage) || currentPage < 1 ? 1 : currentPage;
  const skip = (page - 1) * PAGE_SIZE;

  const [departments, totalDepartments] = await Promise.all([
    prisma.department.findMany({
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: PAGE_SIZE,
    }),

    prisma.department.count(),
  ]);

  const totalPages = Math.ceil(totalDepartments / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <PageHeader
        label="Departments"
        title="Manage Church Departments"
        description="Create and manage the workforce departments in GIC Egbelu."
      />

      <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <DepartmentForm />

        <div>
          <DepartmentList departments={departments} />

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath="/departments"
          />
        </div>
      </section>
    </div>
  );
}