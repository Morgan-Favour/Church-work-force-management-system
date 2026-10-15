"use client";

import { useState } from "react";
import { WorkerCreateModal } from "./add-worker-modal";
import { WorkerInviteModal } from "./worker-invite-modal";
import { Link2, Plus } from "lucide-react";

type Department = {
  id: string;
  name: string;
};

type Props = {
  departments: Department[];
};

export function WorkersPageActions({
  departments,
}: Props) {
  const [createOpen, setCreateOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

  return (
    <>
      <div className="flex gap-3">
        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-bold text-primary-foreground shadow-sm transition hover:opacity-90 lg:px-4 lg:py-2.5"
        >
          <Plus size={18} />
          Add Worker
        </button>

        <button
          onClick={() => setInviteOpen(true)}
          className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-bold text-card-foreground shadow-sm transition hover:bg-muted/50 lg:px-4 lg:py-2.5"
        >
          <Link2 size={18} />
          Invite Worker
        </button>
      </div>

      <WorkerCreateModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        departments={departments}
      />

      <WorkerInviteModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        departments={departments}
      />
    </>
  );
}