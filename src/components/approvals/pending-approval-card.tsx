
"use client";

import { useFormStatus } from "react-dom";

import {
  approveLeader,
  rejectLeader,
} from "@/actions/leader.actions";

import {
  approveWorker,
  rejectWorker,
} from "@/actions/worker.actions";

type Department = {
  department: {
    name: string;
  };
};

export type ApprovalCardData = {
  id: string;
  fullName: string;
  phone: string | null;
  departments: Department[];
  username?: string;
  gender?: string | null;
};

type Props = {
  type: "leader" | "worker";
  approval: ApprovalCardData;
};

function SubmitButton({
  label,
  loadingLabel,
  className,
}: {
  label: string;
  loadingLabel: string;
  className: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`${className} disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          {loadingLabel}
        </span>
      ) : (
        label
      )}
    </button>
  );
}

export function PendingApprovalCard({ type, approval }: Props) {
  const subtitle =
    type === "leader"
      ? `@${approval.username}`
      : approval.gender || "Not specified";

  const idName =
    type === "leader" ? "pendingLeaderId" : "pendingWorkerId";

  const approveAction =
    type === "leader" ? approveLeader : approveWorker;

  const rejectAction =
    type === "leader" ? rejectLeader : rejectWorker;

  const buttonClass =
    "rounded-lg px-5 py-2 font-semibold text-white transition";

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-card-foreground">
          {approval.fullName}
        </h3>

        <p className="text-sm text-muted-foreground">{subtitle}</p>

        <p className="text-sm text-muted-foreground">
          {approval.phone || "No phone number"}
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          {approval.departments.map((dept) => (
            <span
              key={dept.department.name}
              className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
            >
              {dept.department.name}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <form action={approveAction}>
          <input type="hidden" name={idName} value={approval.id} />

          <SubmitButton
            label="Approve"
            loadingLabel="Approving..."
            className={`${buttonClass} bg-emerald-600 hover:bg-emerald-700`}
          />
        </form>

        <form action={rejectAction}>
          <input type="hidden" name={idName} value={approval.id} />

          <SubmitButton
            label="Reject"
            loadingLabel="Rejecting..."
            className={`${buttonClass} bg-destructive hover:opacity-90`}
          />
        </form>
      </div>
    </div>
  );
}
