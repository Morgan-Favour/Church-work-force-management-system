import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { DepartmentForm } from "@/components/departments/department-form";

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

        <SectionCard
          title="Department List"
          description={`${departments.length} department(s) created`}
        >
          {departments.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center sm:p-10">
              <p className="font-semibold text-slate-700">
                No departments yet
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Create your first department to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {departments.map((department) => (
                <a
                  href={`/departments/${department.id}`}
                  key={department.id}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between sm:p-5"
                >
                  <div>
                    <h3 className="font-bold text-slate-900">
                      {department.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {department.description || "No description provided"}
                    </p>
                  </div>

                  <span className="w-fit rounded-full bg-[#0e2d33]/10 px-3 py-1 text-xs font-semibold text-[#0e2d33]">
                    Active
                  </span>
                </a>
              ))}
            </div>
          )}
        </SectionCard>
      </section>
    </div>
  );
}