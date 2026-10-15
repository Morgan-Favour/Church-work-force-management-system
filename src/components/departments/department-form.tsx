"use client";

import { useState, useTransition } from "react";
import { Building2 } from "lucide-react";
import { createDepartment } from "@/actions/department.actions";

type ActionState = {
  error?: string;
  success?: string;
};

export function DepartmentForm() {
  const [state, setState] = useState<ActionState | null>(null);
  const [pending, startTransition] = useTransition();

  function action(formData: FormData) {
    setState(null);

    startTransition(async () => {
      const result = await createDepartment(formData);

      if (result?.error) {
        setState({ error: result.error });
        return;
      }

      setState({
        success: result?.success || "Department created successfully.",
      });
    });
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Building2 size={22} />
        </div>

        <div>
          <h2 className="text-base font-bold text-card-foreground sm:text-lg">
            Add Department
          </h2>
          <p className="text-sm text-muted-foreground">
            Example: Choir, Media, Ushering
          </p>
        </div>
      </div>

      <form action={action} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-semibold text-card-foreground">
            Department Name
          </label>
          <input
            name="name"
            required
            placeholder="Choir"
            className="block w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-card-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-card-foreground">
            Description
          </label>
          <textarea
            name="description"
            rows={4}
            placeholder="Short description of this department"
            className="block w-full resize-none rounded-xl border border-input bg-card px-4 py-3 text-sm text-card-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
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

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Creating..." : "Create Department"}
        </button>
      </form>
    </div>
  );
}