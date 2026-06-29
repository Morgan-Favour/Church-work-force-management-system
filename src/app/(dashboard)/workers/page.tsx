import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { WorkerForm } from "@/components/workers/worker-form";
import { WorkerList } from "@/components/workers/worker-list";

export default async function WorkersPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const isAdmin = session.user.role === UserRole.ADMIN;

  const departments = await prisma.department.findMany({
    where: isAdmin
      ? { isActive: true }
      : {
          id: session.user.departmentId || "",
          isActive: true,
        },
    orderBy: { name: "asc" },
  });

  const workers = await prisma.worker.findMany({
    where: isAdmin
      ? {}
      : {
          departments: {
            some: {
              departmentId: session.user.departmentId || "",
            },
          },
        },
    include: {
      departments: {
        include: {
          department: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const leaderDepartment = departments[0];

  return (
    <div className="space-y-6">
      <PageHeader
        label="Workers"
        title="Manage Church Workers"
        description={
          isAdmin
            ? "Add workers and assign them to one or more departments."
            : "Add and manage workers in your department."
        }
      />

      <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <WorkerForm
          isAdmin={isAdmin}
          departments={departments}
          leaderDepartment={leaderDepartment}
          leaderDepartmentId={session.user.departmentId}
        />

        <WorkerList workers={workers} />
      </section>
    </div>
  );
}