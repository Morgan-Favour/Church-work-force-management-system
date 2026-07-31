"use client";

import { useState } from "react";
import { WorkerCreateModal } from "./worker-create-modal";
import { WorkerInviteModal } from "./worker-invite-modal";

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
          className="rounded-xl bg-[#0e2d33] px-4 py-2 text-white"
        >
          Add Worker
        </button>

        <button
          onClick={() => setInviteOpen(true)}
          className="rounded-xl border border-[#0e2d33] px-4 py-2 text-[#0e2d33]"
        >
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