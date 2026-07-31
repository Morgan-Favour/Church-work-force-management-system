"use client";

import { useState, useTransition } from "react";
import { Users } from "lucide-react";
import { createWorker } from "@/actions/worker.actions";
import  DepartmentCheckboxDropdown from "@/components/workers/department-checkbox-dropdown";
import { createWorkerInvite } from "@/actions/worker.actions";

type Department = {
  id: string;
  name: string;
};

type WorkerFormProps = {
  isAdmin: boolean;
  departments: Department[];
};

type ActionState = {
  error?: string;
  success?: string;
};

export function WorkerForm({ isAdmin, departments }: WorkerFormProps) {
  const [state, setState] = useState<ActionState | null>(null);
  const [pending, startTransition] = useTransition();
  const [inviteLink, setInviteLink] = useState("");
  const [loadingInvite, setLoadingInvite] = useState(false);

  function action(formData: FormData) {
    setState(null);

    startTransition(async () => {
      const result = await createWorker(formData);

      if (result?.error) {
        setState({ error: result.error });
        return;
      }

      setState({ success: result?.success || "Worker added successfully." });
    });
  }

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

      <form id="worker-form" action={action} className="space-y-5">
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
          <p className="mt-2 text-xs text-slate-400">
            Phone number must be unique for each worker.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Gender
          </label>
          <select
            name="gender"
            className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#0e2d33] focus:ring-4 focus:ring-[#0e2d33]/10"
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

        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 rounded-xl bg-[#0e2d33] py-3 font-semibold text-white"
          >
            Add Worker
          </button>

          <button
            type="button"
            onClick={async () => {
              setLoadingInvite(true);

              const form = document.getElementById(
                "worker-form"
              ) as HTMLFormElement;

              const formData = new FormData(form);

              const result = await createWorkerInvite(formData);

              if (result?.inviteLink) {
                setInviteLink(result.inviteLink);
              }

              setLoadingInvite(false);
            }}
            className="rounded-xl border px-5 py-3"
          >
            {loadingInvite ? "Creating..." : "Create Invite"}
          </button>
        </div>
        {inviteLink && (
          <div className="mt-5 rounded-xl border bg-slate-50 p-4">
            <p className="text-sm font-medium">
              Invite Link
            </p>

            <div className="mt-2 flex gap-2">
              <input
                readOnly
                value={inviteLink}
                className="flex-1 rounded-lg border p-2 text-sm"
              />

              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(inviteLink)}
                className="rounded-lg bg-[#0e2d33] px-4 text-white"
              >
                Copy
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}