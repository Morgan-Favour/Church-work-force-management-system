import { Users } from "lucide-react";
import { createWorker } from "@/actions/worker.actions";

type Department = {
  id: string;
  name: string;
};

type WorkerFormProps = {
  isAdmin: boolean;
  departments: Department[];
  leaderDepartment?: Department | null;
  leaderDepartmentId?: string | null;
};

export function WorkerForm({
  isAdmin,
  departments,
  leaderDepartment,
  leaderDepartmentId,
}: WorkerFormProps) {
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
              ? "Register a worker under multiple departments."
              : `Register a worker under ${
                  leaderDepartment?.name || "your department"
                }.`}
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
            className="block w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#0e2d33] focus:ring-4 focus:ring-[#0e2d33]/10"
            placeholder="Worker name"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Phone Number
          </label>
          <input
            name="phone"
            className="block w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#0e2d33] focus:ring-4 focus:ring-[#0e2d33]/10"
            placeholder="080..."
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

          {isAdmin ? (
            <div className="space-y-2 rounded-xl border border-slate-200 p-3">
              {departments.map((department) => (
                <label
                  key={department.id}
                  className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <input
                    type="checkbox"
                    name="departmentIds"
                    value={department.id}
                    className="h-4 w-4"
                  />
                  {department.name}
                </label>
              ))}
            </div>
          ) : (
            <>
              <input
                type="hidden"
                name="departmentIds"
                value={leaderDepartmentId || ""}
              />

              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                {leaderDepartment?.name || "No department assigned"}
              </div>
            </>
          )}
        </div>

        {!isAdmin && !leaderDepartmentId && (
          <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
            You have not been assigned to a department yet.
          </p>
        )}

        <button
          type="submit"
          disabled={!isAdmin && !leaderDepartmentId}
          className="w-full rounded-xl bg-[#0e2d33] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#123940] disabled:cursor-not-allowed disabled:opacity-60"
        >
          Add Worker
        </button>
      </form>
    </div>
  );
}