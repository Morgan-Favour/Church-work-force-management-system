"use client";

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

export function PendingApprovalCard({
  type,
  approval,
}: Props) {
  const subtitle =
    type === "leader"
      ? `@${approval.username}`
      : approval.gender || "Not specified";

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">
          {approval.fullName}
        </h3>

        <p className="text-sm text-gray-500">
          {subtitle}
        </p>

        <p className="text-sm text-gray-600">
          {approval.phone || "No phone number"}
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          {approval.departments.map((dept) => (
            <span
              key={dept.department.name}
              className="rounded-full bg-[#0e2d33]/10 px-3 py-1 text-sm text-[#0e2d33]"
            >
              {dept.department.name}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <form
          action={
            type === "leader"
              ? approveLeader
              : approveWorker
          }
        >
          <input
            type="hidden"
            name={
              type === "leader"
                ? "pendingLeaderId"
                : "pendingWorkerId"
            }
            value={approval.id}
          />

          <button
            type="submit"
            className="rounded-lg bg-green-600 px-5 py-2 font-semibold text-white hover:bg-green-700"
          >
            Approve
          </button>
        </form>

        <form
          action={
            type === "leader"
              ? rejectLeader
              : rejectWorker
          }
        >
          <input
            type="hidden"
            name={
              type === "leader"
                ? "pendingLeaderId"
                : "pendingWorkerId"
            }
            value={approval.id}
          />

          <button
            type="submit"
            className="rounded-lg bg-red-600 px-5 py-2 font-semibold text-white hover:bg-red-700"
          >
            Reject
          </button>
        </form>
      </div>
    </div>
  );
}