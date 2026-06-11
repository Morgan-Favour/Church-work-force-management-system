import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Building2 } from "lucide-react";

async function createDepartment(formData: FormData) {
  "use server";

  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim();

  if (!name) {
    return;
  }

  const existingDepartment = await prisma.department.findUnique({
    where: { name },
  });

  if (existingDepartment) {
    return;
  }

  await prisma.department.create({
    data: {
      name,
      description: description || null,
    },
  });

  revalidatePath("/departments");
  revalidatePath("/dashboard");
}

export default async function DepartmentsPage() {
  const departments = await prisma.department.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-medium text-[#0e2d33]">Departments</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Manage Church Departments
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          Create and manage the workforce departments in GIC Egbelu.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0e2d33]/10 text-[#0e2d33]">
              <Building2 size={22} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Add Department
              </h2>
              <p className="text-sm text-slate-500">
                Example: Choir, Media, Ushering
              </p>
            </div>
          </div>

          <form action={createDepartment} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Department Name
              </label>
              <input
                name="name"
                required
                className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0e2d33] focus:ring-4 focus:ring-[#0e2d33]/10"
                placeholder="Choir"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                className="block w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0e2d33] focus:ring-4 focus:ring-[#0e2d33]/10"
                placeholder="Short description of this department"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-[#0e2d33] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#123940]"
            >
              Create Department
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">
              Department List
            </h2>
            <p className="text-sm text-slate-500">
              {departments.length} department(s) created
            </p>
          </div>

          {departments.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center">
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
                <div
                  key={department.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 p-4"
                >
                  <div>
                    <h3 className="font-bold text-slate-900">
                      {department.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {department.description || "No description provided"}
                    </p>
                  </div>

                  <span className="rounded-full bg-[#0e2d33]/10 px-3 py-1 text-xs font-semibold text-[#0e2d33]">
                    Active
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}