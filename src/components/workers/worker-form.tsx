"use client";

import { useState, useTransition } from "react";
import { Users } from "lucide-react";
import { createWorker } from "@/actions/worker.actions";
import DepartmentCheckboxDropdown from "@/components/workers/department-checkbox-dropdown";
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
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Users size={22} />
        </div>

        <div>
          <h2 className="text-base font-bold text-card-foreground sm:text-lg">
            Add Worker
          </h2>

          <p className="text-sm text-muted-foreground">
            {isAdmin
              ? "Register workers and assign them to departments."
              : "Register workers under departments you lead."}
          </p>
        </div>
      </div>

      <form id="worker-form" action={action} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-semibold text-card-foreground">
            Full Name
          </label>
          <input
            name="fullName"
            required
            placeholder="Worker name"
            className="block w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-card-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
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
            placeholder="08012345678"
            className="block w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-card-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Phone number must be unique for each worker.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-card-foreground">
            Gender
          </label>
          <select
            name="gender"
            defaultValue=""
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
            <DepartmentCheckboxDropdown departments={departments} />
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

        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-sm transition hover:opacity-90"
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
            className="rounded-xl border border-border bg-card px-5 py-3 text-sm font-bold text-card-foreground transition hover:bg-muted/50"
          >
            {loadingInvite ? "Creating..." : "Create Invite"}
          </button>
        </div>

        {inviteLink && (
          <div className="mt-5 rounded-xl border border-border bg-muted/50 p-4">
            <p className="text-sm font-semibold text-card-foreground">
              Invite Link
            </p>

            <div className="mt-2 flex gap-2">
              <input
                readOnly
                value={inviteLink}
                className="flex-1 rounded-lg border border-input bg-card px-3 py-2 text-sm text-card-foreground outline-none"
              />

              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(inviteLink)}
                className="rounded-lg bg-primary px-4 text-sm font-bold text-primary-foreground transition hover:opacity-90"
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