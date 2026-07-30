import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-log";

export async function rejectLeaderService(pendingLeaderId: string) {
  const pending = await prisma.pendingLeader.findUnique({
    where: {
      id: pendingLeaderId,
    },
    include: {
      departments: {
        include: {
          department: true,
        },
      },
    },
  });

  if (!pending) {
    throw new Error("Pending leader not found.");
  }

  if (pending.status !== "PENDING") {
    throw new Error("This request has already been processed.");
  }

  await prisma.$transaction(async (tx) => {
    await tx.pendingLeader.update({
      where: {
        id: pendingLeaderId,
      },
      data: {
        status: "REJECTED",
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
      action: "REJECT_LEADER",
      description: `${pending.fullName || "Pending Leader"} was rejected.`,
    });
  });
}