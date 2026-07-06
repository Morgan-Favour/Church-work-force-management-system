import Link from "next/link";
import {
  deactivateDepartment,
  reactivateDepartment,
} from "@/actions/department.actions";
import { SectionCard } from "@/components/ui/section-card";

type Department = {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
};

export function DepartmentList({
  departments,
}: {
  departments: Department[];
}) {
  return (
    <SectionCard
      title="Department List"
      description={`${departments.length} department(s) created`}
    >
      {departments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center sm:p-10">
          <p className="font-semibold text-slate-700">No departments yet</p>
          <p className="mt-1 text-sm text-slate-500">
            Create your first department to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {departments.map((department) => (
            <div
              key={department.id}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
            >
              <Link href={`/departments/${department.id}`} className="min-w-0 flex-1">
                <h3 className="font-bold text-slate-900">
                  {department.name}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {department.description || "No description provided"}
                </p>
              </Link>

              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={
                    department.isActive
                      ? "w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
                      : "w-fit rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700"
                  }
                >
                  {department.isActive ? "Active" : "Inactive"}
                </span>

                {department.isActive ? (
                  <form action={deactivateDepartment}>
                    <input type="hidden" name="departmentId" value={department.id} />
                    <button
                      type="submit"
                      className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                    >
                      Deactivate
                    </button>
                  </form>
                ) : (
                  <form action={reactivateDepartment}>
                    <input type="hidden" name="departmentId" value={department.id} />
                    <button
                      type="submit"
                      className="rounded-full border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                    >
                      Reactivate
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}