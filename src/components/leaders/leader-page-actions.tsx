"use client";

import { useState } from "react";
import { Plus, Link2 } from "lucide-react";
import { AddLeaderModal } from "./add-leader-modal";
import { LeaderInviteModal } from "./leader-invite-modal";

type Department = {
  id: string;
  name: string;
};

export function LeaderActions({
  departments,
}: {
  departments: Department[];
}) {
  const [showAddLeader, setShowAddLeader] = useState(false);
  const [showInvite, setShowInvite] = useState(false);

  return (
    <>
      <div className="flex gap-3">
        <button
          onClick={() => setShowAddLeader(true)}
          className="flex items-center gap-2 rounded-xl bg-[#0e2d33] px-3 py-2 lg:px-4 lg:py-2 font-semibold text-white text-sm"
        >
          <Plus size={18} />
          Add Leader
        </button>

        <button
          onClick={() => setShowInvite(true)}
          className="flex items-center gap-2 rounded-xl border border-[#0e2d33] px-3 py-2 lg:px-4 lg:py-2 text-[#0e2d33]"
        >
          <Link2 size={18} />
          Create Invite
        </button>
      </div>


      <AddLeaderModal
        open={showAddLeader}
        onClose={() => setShowAddLeader(false)}
        departments={departments}
      />

      <LeaderInviteModal
        open={showInvite}
        onClose={() => setShowInvite(false)}
        departments={departments}
      />
    </>
  );
}