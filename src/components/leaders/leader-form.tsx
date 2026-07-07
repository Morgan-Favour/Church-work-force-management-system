"use client";

import { useState, useTransition } from "react";
import { UserCog } from "lucide-react";
import { createLeader } from "@/actions/leader.actions";

type Department = {
  id: string;
  name: string;
};

type ActionState = {
  error?: string;
  success?: string;
};

export function LeaderForm({ departments }: { departments: Department[] }) {
  const [state, setState] = useState<ActionState | null>(null);
  const [pending, startTransition] = useTransition();

  function action(formData: FormData) {
    setState(null);

    startTransition(async () => {
      const result = await createLeader(formData);

      if (result?.error) {
        setState({ error: result.error });
        return;
      }

      setState({
        success: result?.success || "Leader added successfully.",
      });
    });
  }

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
            Create a leader account or assign an existing leader to another
            department.
          </p>
        </div>
      </div>

      <form action={action} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Full Name
          </label>

          <input
            name="fullName"
            required
            placeholder="Morgan Destiny"
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
            inputMode="numeric"
            pattern="[0-9]{7,15}"
            required
            placeholder="08012345678"
            className="block w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#0e2d33] focus:ring-4 focus:ring-[#0e2d33]/10"
          />

          <p className="mt-2 text-xs text-slate-400">
            Use numbers only. Example: 08012345678.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Username
          </label>

          <input
            name="username"
            type="text"
            required
            placeholder="morgan"
            className="block w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#0e2d33] focus:ring-4 focus:ring-[#0e2d33]/10"
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
            placeholder="Minimum 8 characters"
            className="block w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#0e2d33] focus:ring-4 focus:ring-[#0e2d33]/10"
          />

          <p className="mt-2 text-xs text-slate-400">
            Required only when creating a new leader login.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Department to Lead
          </label>

          <select
            name="departmentId"
            required
            className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#0e2d33] focus:ring-4 focus:ring-[#0e2d33]/10"
          >
            <option value="">Select department</option>

            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
        </div>

        {state?.error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {state.error}
          </div>
        )}

        {state?.success && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            {state.success}
          </div>
        )}

        <button
          disabled={pending}
          type="submit"
          className="w-full rounded-xl bg-[#0e2d33] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#123940] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Creating..." : "Create Leader"}
        </button>
      </form>
    </div>
  );
}