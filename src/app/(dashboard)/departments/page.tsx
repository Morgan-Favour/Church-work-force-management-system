import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { PageHeader } from "@/components/ui/page-header";
import { DepartmentForm } from "@/components/departments/department-form";
import { DepartmentList } from "@/components/departments/department-list";

export default async function DepartmentsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const departments = await prisma.department.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        label="Departments"
        title="Manage Church Departments"
        description="Create and manage the workforce departments in GIC Egbelu."
      />

      <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <DepartmentForm />
        <DepartmentList departments={departments} />
      </section>
    </div>
  );
}