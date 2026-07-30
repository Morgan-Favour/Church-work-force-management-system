"use client";

import { useTransition } from "react";
import {
  approveLeader,
  rejectLeader,
} from "@/actions/approval.actions";

type Department = {
  department: {
    name: string;
  };
};

type PendingLeader = {
  id: string;
  fullName: string;
  username: string;
  phone: string | null;
  createdAt: Date;
  departments: Department[];
};

export default function PendingLeaderCard({
  leader,
}: {
  leader: PendingLeader;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">

      <div className="space-y-2">

        <h3 className="text-lg font-semibold">
          {leader.fullName}
        </h3>

        <p className="text-sm text-gray-500">
          @{leader.username}
        </p>

        <p className="text-sm">
          {leader.phone || "No phone"}
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          {leader.departments.map((dept) => (
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

        <button
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              await approveLeader(leader.id);
            })
          }
          className="rounded-lg bg-green-600 px-5 py-2 font-semibold text-white"
        >
          Approve
        </button>

        <button
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              await rejectLeader(leader.id);
            })
          }
          className="rounded-lg bg-red-600 px-5 py-2 font-semibold text-white"
        >
          Reject
        </button>

      </div>

    </div>
  );
}