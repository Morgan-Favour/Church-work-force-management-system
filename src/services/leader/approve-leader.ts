
import { prisma } from "@/lib/prisma";
import { ApprovalStatus, UserRole } from "@prisma/client";
import { logActivity } from "@/lib/activity-log";

export async function approveLeaderService(
  pendingLeaderId: string,
  actorId?: string
) {
  await prisma.$transaction(
    async (tx) => {
      const pending = await tx.pendingLeader.findUnique({
        where: {
          id: pendingLeaderId,
        },
        include: {
          departments: true,
        },
      });

      if (!pending) {
        throw new Error("Pending leader not found.");
      }

      if (pending.status !== ApprovalStatus.PENDING) {
        throw new Error("Leader has already been processed.");
      }

      if (!pending.phone?.trim()) {
        throw new Error("Leader's phone number is missing.");
      }

      if (!pending.password) {
        throw new Error("Leader's password is missing.");
      }

      const username = pending.username.toLowerCase().trim();
      const phone = pending.phone.trim();

      const existingUser = await tx.user.findUnique({
        where: {
          username,
        },
      });

      if (existingUser) {
        throw new Error("Username already exists.");
      }

      const departmentIds = [
        ...new Set(pending.departments.map((d) => d.departmentId)),
      ];

      if (departmentIds.length === 0) {
        throw new Error("The leader has no assigned departments.");
      }

      // Reuse an existing worker if the phone number already exists.
      let worker = await tx.worker.findUnique({
        where: {
          phone,
        },
      });

      // Only create a worker when no matching phone number exists.
      if (!worker) {
        worker = await tx.worker.create({
          data: {
            fullName: pending.fullName,
            phone,
            isActive: true,
          },
        });
      }

      // Add the invited departments without removing existing memberships.
      await Promise.all(
        departmentIds.map((departmentId) =>
          tx.workerDepartment.upsert({
            where: {
              workerId_departmentId: {
                workerId: worker.id,
                departmentId,
              },
            },
            update: {},
            create: {
              workerId: worker.id,
              departmentId,
            },
          })
        )
      );

      // Create the leader's login account and link it to the worker.
      const user = await tx.user.create({
        data: {
          fullName: pending.fullName,
          username,
          password: pending.password,
          role: UserRole.DEPARTMENT_LEADER,
          isActive: true,
          workerId: worker.id,
        },
      });

      // Assign leadership to all invited departments.
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
    },
    {
      maxWait: 10000,
      timeout: 30000,
    }
  );
}
