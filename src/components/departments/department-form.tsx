import { Building2 } from "lucide-react";
import { createDepartment } from "@/actions/department.actions";

export function DepartmentForm() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0e2d33]/10 text-[#0e2d33]">
          <Building2 size={22} />
        </div>

        <div>
          <h2 className="text-base font-bold text-slate-900 sm:text-lg">
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
  );
}