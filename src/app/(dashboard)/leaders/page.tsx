import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { authOptions } from "@/lib/auth";
import { LeaderForm } from "@/components/leaders/leader-form";
import { LeaderList } from "@/components/leaders/leader-list";

export default async function LeadersPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const departments = await prisma.department.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  const leaders = await prisma.user.findMany({
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
  });

  return (
    <div className="space-y-6">
      <PageHeader
        label="Leaders"
        title="Manage Church Leaders"
        description="Create login accounts for department leaders and automatically add them as workers."
      />

      <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <LeaderForm departments={departments} />

       <LeaderList leaders={leaders} />
      </section>
    </div>
  );
}