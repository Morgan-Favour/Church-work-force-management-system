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
  // Prevent inviting departments that already have pending worker invites
  const pendingInvite = await prisma.pendingWorker.findFirst({
    where: {
      status: "PENDING",
      departments: {
        some: {
          departmentId: {
            in: departmentIds,
          },
        },
      },
    },
  });

  if (pendingInvite) {
    return {
      error:
        "One or more selected departments already have a pending worker invitation.",
    };
  }

  const token = generateInviteToken();

  const invite = await prisma.invite.create({
    data: {
      token,
      type: InviteType.WORKER,
      createdById,
      expiresAt: generateExpiryDate(),

      departments: {
        create: departmentIds.map((departmentId) => ({
          departmentId,
        })),
      },
    },
  });

  await prisma.pendingWorker.create({
    data: {
      inviteId: invite.id,
      fullName: "",
      phone: null,
      gender: null,

      departments: {
        create: departmentIds.map((departmentId) => ({
          departmentId,
        })),
      },
    },
  });

  return {
    success: "Invite created successfully.",
    inviteLink: `${process.env.NEXTAUTH_URL}/invite/worker/${token}`,
  };
}