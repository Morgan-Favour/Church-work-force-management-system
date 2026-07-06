import { UserCog } from "lucide-react";
import { createLeader } from "@/actions/leader.actions";

type Department = {
  id: string;
  name: string;
};

export function LeaderForm({ departments }: { departments: Department[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0e2d33]/10 text-[#0e2d33]">
          <UserCog size={22} />
        </div>

        <div>
          <h2 className="text-base font-bold text-slate-900 sm:text-lg">
            Add Leader
          </h2>

          <p className="text-sm text-slate-500">
            Create a leader account or assign an existing leader to another department.
          </p>
        </div>
      </div>

      <form action={createLeader} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Full Name
          </label>

          <input
            name="fullName"
            required
            className="block w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#0e2d33] focus:ring-4 focus:ring-[#0e2d33]/10"
            placeholder="Morgan Destiny"
          />
        </div>


        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Phone Number
          </label>

          <input
            name="phone"
            required
            className="block w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#0e2d33] focus:ring-4 focus:ring-[#0e2d33]/10"
            placeholder="08012345678"
          />
        </div>


        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Username
          </label>

          <input
            name="username"
            type="text"
            required
            className="block w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#0e2d33] focus:ring-4 focus:ring-[#0e2d33]/10"
            placeholder="morgan"
          />      
        </div>


        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Password
          </label>

          <input
            name="password"
            type="password"
            minLength={8}
            className="block w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#0e2d33] focus:ring-4 focus:ring-[#0e2d33]/10"
            placeholder="Minimum 8 characters"
          />
        </div>


        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Department to Lead
          </label>

          <select
            name="departmentId"
            required
            className="block w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#0e2d33] focus:ring-4 focus:ring-[#0e2d33]/10"
          >
            <option value="">Select department</option>

            {departments.map((department) => (
              <option 
                key={department.id} 
                value={department.id}
              >
                {department.name}
              </option>
            ))}
          </select>
        </div>


        <button
          type="submit"
          className="w-full rounded-xl bg-[#0e2d33] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#123940]"
        >
          Add Leader
        </button>
      </form>
    </div>
  );
}