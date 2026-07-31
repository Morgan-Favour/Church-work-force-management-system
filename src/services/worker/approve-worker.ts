import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-log";
import { ApprovalStatus } from "@prisma/client";

export async function approveWorkerService(
  pendingWorkerId: string,
  actorId?: string
) {
  const pending = await prisma.pendingWorker.findUnique({
    where: {
      id: pendingWorkerId,
    },
    include: {
      invite: true,
      departments: true,
    },
  });

  if (!pending) {
    throw new Error("Pending worker not found.");
  }

  if (pending.status !== ApprovalStatus.PENDING) {
    throw new Error("Worker has already been processed.");
  }

  if (!pending.phone) {
    throw new Error("Worker has not completed registration.");
  }

  const existingWorker = await prisma.worker.findUnique({
    where: {
      phone: pending.phone,
    },
  });

  if (existingWorker) {
    throw new Error("Phone number already exists.");
  }

  const departmentIds = pending.departments.map(
    (d) => d.departmentId
  );

  await prisma.$transaction(async (tx) => {
    const worker = await tx.worker.create({
      data: {
        fullName: pending.fullName,
        phone: pending.phone,
        gender: pending.gender,
        isActive: true,
      },
    });

    await tx.workerDepartment.createMany({
      data: departmentIds.map((departmentId) => ({
        workerId: worker.id,
        departmentId,
      })),
      skipDuplicates: true,
    });

    await tx.pendingWorker.update({
      where: {
        id: pending.id,
      },
      data: {
        status: ApprovalStatus.APPROVED,
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
      action: "APPROVE_WORKER",
      description: `${worker.fullName} approved as worker.`,
      actorId,
      departmentId: departmentIds[0],
    });
  });
}