import { prisma } from "@/lib/prisma";
import { ApprovalStatus } from "@prisma/client";
import { logActivity } from "@/lib/activity-log";

export async function rejectWorkerService(
  pendingWorkerId: string,
  actorId?: string
) {
  const pending = await prisma.pendingWorker.findUnique({
    where: {
      id: pendingWorkerId,
    },
  });

  if (!pending) {
    throw new Error("Pending worker not found.");
  }

  await prisma.$transaction(async (tx) => {
    await tx.pendingWorker.update({
      where: {
        id: pendingWorkerId,
      },
      data: {
        status: ApprovalStatus.REJECTED,
      },
    });

    await tx.invite.update({
      where: {
        id: pending.inviteId,
      },
      data: {
        used: true,
      },
    });

    await logActivity(tx, {
      action: "REJECT_WORKER",
      description: `${pending.fullName}'s registration was rejected.`,
      actorId,
    });
  });
}