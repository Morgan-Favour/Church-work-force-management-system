
"use client";

import { useState } from "react";
import { AssignLeaderDepartmentModal } from "./assign-leader-department-modal";

type Department = {
  id: string;
  name: string;
};

type Props = {
  leaderId: string;
  leaderName: string;
  isActive: boolean;
  departments: Department[];
  occupiedDepartmentIds: string[];
};

export function LeaderDepartmentActions({
  leaderId,
  leaderName,
  isActive,
  departments,
  occupiedDepartmentIds,
}: Props) {
  const [showAssignModal, setShowAssignModal] = useState(false);

  return (
    <>
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-card-foreground">
              Department Assignments
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Assign another department to this leader&apos;s existing account.
            </p>
          </div>

          <button
            type="button"
            disabled={!isActive}
            onClick={() => setShowAssignModal(true)}
            className="w-fit rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Assign Another Department
          </button>
        </div>
      </div>

      {showAssignModal && (
        <AssignLeaderDepartmentModal
          open={true}
          onClose={() => setShowAssignModal(false)}
          leaderId={leaderId}
          leaderName={leaderName}
          departments={departments}
          occupiedDepartmentIds={occupiedDepartmentIds}
        />
      )}
    </>
  );
}
