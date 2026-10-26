import { prisma } from "@/lib/prisma";
import { ApprovalStatus, UserRole } from "@prisma/client";
import { logActivity } from "@/lib/activity-log";


export async function approveLeaderService(
  pendingLeaderId: string,
  actorId?: string
) {
  const pending = await prisma.pendingLeader.findUnique({
    where: {
      id: pendingLeaderId,
    },
    include: {
      invite: true,
      departments: true,
    },
  });

  if (!pending) {
    throw new Error("Pending leader not found.");
  }

  if (pending.status !== ApprovalStatus.PENDING) {
    throw new Error("Leader has already been processed.");
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      username: pending.username,
    },
  });

  if (existingUser) {
    throw new Error("Username already exists.");
  }

  const departmentIds = pending.departments.map(
    (d) => d.departmentId
  );

  if (departmentIds.length === 0) {
    throw new Error("The leader has no assigned departments.");
  }

  await prisma.$transaction(async (tx) => {
    // Create the worker profile first.
    const worker = await tx.worker.create({
      data: {
        fullName: pending.fullName,
        phone: pending.phone,
        isActive: true,
        departments: {
          create: departmentIds.map((departmentId) => ({
            departmentId,
          })),
        },
      },
      

    });

    // Create the leader's login account and link it to the worker.
    const user = await tx.user.create({
      data: {
        fullName: pending.fullName,
        username: pending.username,
        password: pending.password!,
        role: UserRole.DEPARTMENT_LEADER,
        isActive: true,
        workerId: worker.id,
      },
    });

    // Assign the leader role to the invited departments.
    await tx.leaderDepartment.createMany({
      data: departmentIds.map((departmentId) => ({
        userId: user.id,
        departmentId,
      })),
      skipDuplicates: true,
    });

    await tx.pendingLeader.update({
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
      action: "APPROVE_LEADER",
      description: `${user.fullName} approved as department leader.`,
      actorId,
      departmentId: departmentIds[0],
    });
  }, {
    maxWait: 10000,
    timeout: 15000,
  });
}
