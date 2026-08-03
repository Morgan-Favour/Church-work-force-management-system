"use client";

import { useState } from "react";
import { WorkerCreateModal } from "./add-worker-modal"
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
          className="flex items-center gap-1 rounded-xl bg-[#0e2d33] px-3 py-2 lg:px-4 lg:py-2 text-white"
        >
          <Plus size={18} />
          Add Worker
        </button>

        <button
          onClick={() => setInviteOpen(true)}
          className="flex items-center gap-1 rounded-xl border border-[#0e2d33] px-3 py-2 lg:px-4 lg:py-2 text-[#0e2d33]"
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