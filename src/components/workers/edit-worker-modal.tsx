"use client";

import { useState, useTransition } from "react";
import { X, UserRound } from "lucide-react";
import { updateWorker } from "@/actions/worker.actions";
import { DepartmentCheckboxDropdown } from "@/components/workers/department-checkbox-dropdown";

type Department = {
  id: string;
  name: string;
};

type Worker = {
  id: string;
  fullName: string;
  phone: string | null;
  gender: string | null;
  departments: {
    departmentId: string;
  }[];
};

type ActionState = {
  error?: string;
  success?: string;
};

export function EditWorkerModal({
  worker,
  departments,
}: {
  worker: Worker;
  departments: Department[];
}) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<ActionState | null>(null);
  const [pending, startTransition] = useTransition();

  const workerDepartmentIds = worker.departments.map(
    (item) => item.departmentId
  );

  function action(formData: FormData) {
    setState(null);

    startTransition(async () => {
      const result = await updateWorker(formData);

      if (result?.error) {
        setState({ error: result.error });
        return;
      }

      setState({ success: result?.success || "Worker updated successfully." });
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-fit rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#0e2d33] transition hover:bg-slate-100"
      >
        Edit Worker
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0e2d33]/10 text-[#0e2d33]">
                  <UserRound size={22} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Edit Worker
                  </h2>
                  <p className="text-sm text-slate-500">
                    Updating profile for{" "}
                    <span className="font-semibold text-slate-700">
                      {worker.fullName}
                    </span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50"
              >
                <X size={18} />
              </button>
            </div>

            <form action={action} className="space-y-5 p-5 sm:p-6">
              <input type="hidden" name="workerId" defaultValue={worker.id} />

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Full Name
                </label>
                <input
                  name="fullName"
                  defaultValue={worker.fullName}
                  required
                  placeholder="Enter worker full name"
                  className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0e2d33] focus:ring-4 focus:ring-[#0e2d33]/10"
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
                  defaultValue={worker.phone || ""}
                  placeholder="08012345678"
                  className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0e2d33] focus:ring-4 focus:ring-[#0e2d33]/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Gender
                </label>
                <select
                  name="gender"
                  defaultValue={worker.gender || ""}
                  className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0e2d33] focus:ring-4 focus:ring-[#0e2d33]/10"
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
                  <DepartmentCheckboxDropdown
                    departments={departments}
                    defaultSelectedIds={workerDepartmentIds}
                  />
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

              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={pending}
                  className="rounded-xl bg-[#0e2d33] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#123940] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {pending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}