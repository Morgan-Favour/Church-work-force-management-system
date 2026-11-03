
import { prisma } from "@/lib/prisma";
import { UserRole, Prisma } from "@prisma/client";
import { logActivity } from "@/lib/activity-log";

export async function assignLeaderDepartmentService(
  leaderId: string,
  departmentId: string,
  actorId: string
) {
  try {
    return await prisma.$transaction(
      async (tx) => {
        // Find the existing leader and their worker profile.
        const leader = await tx.user.findUnique({
          where: { id: leaderId },
          include: { worker: true },
        });

        if (!leader || leader.role !== UserRole.DEPARTMENT_LEADER) {
          throw new Error("Department leader not found.");
        }

        if (!leader.isActive) {
          throw new Error("This leader's account is inactive.");
        }

        if (!leader.workerId || !leader.worker) {
          throw new Error("This leader does not have a worker profile.");
        }

        // Confirm that the department exists and is active.
        const department = await tx.department.findFirst({
          where: {
            id: departmentId,
            isActive: true,
          },
        });

        if (!department) {
          throw new Error("Department not found or inactive.");
        }

        // Prevent assigning the same department twice.
        const existingAssignment = await tx.leaderDepartment.findUnique({
          where: {
            userId_departmentId: {
              userId: leaderId,
              departmentId,
            },
          },
        });

        if (existingAssignment) {
          throw new Error("This leader already leads this department.");
        }

        // Ensure the department has no other leader.
        const departmentLeader = await tx.leaderDepartment.findUnique({
          where: { departmentId },
          include: { user: true },
        });

        if (departmentLeader) {
          throw new Error(
            `${department.name} is already led by ${departmentLeader.user.fullName}.`
          );
        }

        // Assign the department to the existing leader.
        await tx.leaderDepartment.create({
          data: {
            userId: leaderId,
            departmentId,
          },
        });

        // Preserve existing worker memberships.
        await tx.workerDepartment.upsert({
          where: {
            workerId_departmentId: {
              workerId: leader.workerId,
              departmentId,
            },
          },
          update: {},
          create: {
            workerId: leader.workerId,
            departmentId,
          },
        });

        await logActivity(tx, {
          action: "ASSIGN_LEADER_DEPARTMENT",
          description: `${leader.fullName} was assigned to lead ${department.name}.`,
          actorId,
          departmentId,
        });

        return {
          success: `${leader.fullName} is now leading ${department.name}.`,
        };
      },
      {
        maxWait: 10000,
        timeout: 30000,
      }
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error(
        "This department has already been assigned to another leader."
      );
    }

    throw error;
  }
}
