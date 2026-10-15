"use client";

import { useState, useTransition } from "react";
import { X, UserRound } from "lucide-react";
import { updateWorker } from "@/actions/worker.actions";
import DepartmentCheckboxDropdown from "@/components/workers/department-checkbox-dropdown";

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
        className="w-fit rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-card-foreground transition hover:bg-muted/50 shadow-sm"
      >
        Edit Worker
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-border bg-card shadow-2xl">
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border bg-card p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <UserRound size={22} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-card-foreground">
                    Edit Worker
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Updating profile for{" "}
                    <span className="font-semibold text-card-foreground">
                      {worker.fullName}
                    </span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-border p-2 text-muted-foreground transition hover:bg-muted/50 hover:text-card-foreground"
              >
                <X size={18} />
              </button>
            </div>

            <form action={action} className="space-y-5 p-5 sm:p-6">
              <input type="hidden" name="workerId" defaultValue={worker.id} />

              <div>
                <label className="mb-2 block text-sm font-semibold text-card-foreground">
                  Full Name
                </label>
                <input
                  name="fullName"
                  defaultValue={worker.fullName}
                  required
                  placeholder="Enter worker full name"
                  className="block w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-card-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-card-foreground">
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
                  className="block w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-card-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-card-foreground">
                  Gender
                </label>
                <select
                  name="gender"
                  defaultValue={worker.gender || ""}
                  className="block w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-card-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                >
                  <option value="" disabled>
                    Select gender
                  </option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-card-foreground">
                  Department(s)
                </label>

                {departments.length === 0 ? (
                  <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">
                    No department available.
                  </div>
                ) : (
                  <DepartmentCheckboxDropdown
                    departments={departments}
                    selected={workerDepartmentIds}
                  />
                )}
              </div>

              {state?.error && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">
                  {state.error}
                </div>
              )}

              {state?.success && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  {state.success}
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-xl border border-border bg-card px-5 py-3 text-sm font-bold text-card-foreground transition hover:bg-muted/50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={pending}
                  className="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
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