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
          className="flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-bold text-primary-foreground shadow-sm transition hover:opacity-90 lg:px-4 lg:py-2.5"
        >
          <Plus size={18} />
          Add Leader
        </button>

        <button
          onClick={() => setShowInvite(true)}
          className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-bold text-card-foreground shadow-sm transition hover:bg-muted/50 lg:px-4 lg:py-2.5"
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