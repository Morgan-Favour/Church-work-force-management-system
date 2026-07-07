import { Users } from "lucide-react";
import { createWorker } from "@/actions/worker.actions";
import { DepartmentCheckboxDropdown } from "@/components/workers/department-checkbox-dropdown";

type Department = {
  id: string;
  name: string;
};

type WorkerFormProps = {
  isAdmin: boolean;
  departments: Department[];
};

export function WorkerForm({ isAdmin, departments }: WorkerFormProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0e2d33]/10 text-[#0e2d33]">
          <Users size={22} />
        </div>

        <div>
          <h2 className="text-base font-bold text-slate-900 sm:text-lg">
            Add Worker
          </h2>

          <p className="text-sm text-slate-500">
            {isAdmin
              ? "Register workers and assign them to departments."
              : "Register workers under departments you lead."}
          </p>
        </div>
      </div>

      <form action={createWorker} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Full Name
          </label>
          <input
            name="fullName"
            required
            placeholder="Worker name"
            className="block w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#0e2d33] focus:ring-4 focus:ring-[#0e2d33]/10"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Phone Number
          </label>
          <input
            name="phone"
            type="tel"
            required
            inputMode="numeric"
            pattern="[0-9]{7,15}"
            placeholder="08012345678"
            className="block w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#0e2d33] focus:ring-4 focus:ring-[#0e2d33]/10"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Gender
          </label>
          <select
            name="gender"
            className="block w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#0e2d33] focus:ring-4 focus:ring-[#0e2d33]/10"
          >
            <option value="">Select gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Department(s)
          </label>

          {departments.length === 0 ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              No department available.
            </div>
          ) : (
            <DepartmentCheckboxDropdown departments={departments} />
          )}
        </div>

        <button
          type="submit"
          disabled={departments.length === 0}
          className="w-full rounded-xl bg-[#0e2d33] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#123940] disabled:cursor-not-allowed disabled:opacity-60"
        >
          Add Worker
        </button>
      </form>
    </div>
  );
}