
import { prisma } from "@/lib/prisma";
import {
  generateExpiryDate,
  generateInviteToken,
} from "@/lib/invite";
import { InviteType } from "@prisma/client";

type CreateWorkerInviteInput = {
  createdById: string;
  departmentIds: string[];
};

export async function createWorkerInviteService({
  createdById,
  departmentIds,
}: CreateWorkerInviteInput) {
  const selectedDepartmentIds = [...new Set(departmentIds)].sort();

  if (selectedDepartmentIds.length === 0) {
    return { error: "Please select at least one department." };
  }

  // Look for existing, unexpired worker invites for these departments.
  const existingInvites = await prisma.invite.findMany({
    where: {
      type: InviteType.WORKER,
      expiresAt: {
        gt: new Date(),
      },
      departments: {
        some: {
          departmentId: {
            in: selectedDepartmentIds,
          },
        },
      },
    },
    include: {
      departments: {
        select: {
          departmentId: true,
        },
      },
    },
  });

  // Reuse an invite only when its department group matches exactly.
  const existingInvite = existingInvites.find((invite) => {
    const linkedDepartmentIds = invite.departments
      .map((department) => department.departmentId)
      .sort();

    return (
      linkedDepartmentIds.length === selectedDepartmentIds.length &&
      linkedDepartmentIds.every(
        (id, index) => id === selectedDepartmentIds[index]
      )
    );
  });

  if (existingInvite) {
    return {
      success: "Existing invite link retrieved.",
      inviteLink: `${process.env.NEXTAUTH_URL}/invite/worker/${existingInvite.token}`,
    };
  }

  // Create a new invite only if no reusable invite exists.
  const token = generateInviteToken();

  const invite = await prisma.invite.create({
    data: {
      token,
      type: InviteType.WORKER,
      createdById,
      expiresAt: generateExpiryDate(),
      departments: {
        create: selectedDepartmentIds.map((departmentId) => ({
          departmentId,
        })),
      },
    },
  });

  return {
    success: "Invite created successfully.",
    inviteLink: `${process.env.NEXTAUTH_URL}/invite/worker/${invite.token}`,
  };
}
