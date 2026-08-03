import { InviteType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  generateExpiryDate,
  generateInviteToken,
} from "@/lib/invite";

type CreateLeaderInviteInput = {
  createdById: string;
  departmentIds: string[];
};

export async function createLeaderInviteService({
  createdById,
  departmentIds,
}: CreateLeaderInviteInput) {
  if (departmentIds.length === 0) {
    return {
      error: "Select at least one department.",
    };
  }

  // Department already has a leader
  const existingLeader = await prisma.leaderDepartment.findFirst({
    where: {
      departmentId: {
        in: departmentIds,
      },
    },
    include: {
      department: true,
      user: true,
    },
  });

  if (existingLeader) {
    return {
      error: `${existingLeader.department.name} already has a leader (${existingLeader.user.fullName}).`,
    };
  }

  // Department already has a pending registration
  const existingPending = await prisma.pendingLeader.findFirst({
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
    include: {
      departments: {
        include: {
          department: true,
        },
      },
    },
  });

  if (existingPending) {
    return {
      error:
        `A leader invitation is already pending for (${existingPending.departments.map((d) => d.department.name).join(', ')}).`,
    };
  }

  const token = generateInviteToken();

  const invite = await prisma.invite.create({
    data: {
      token,
      type: InviteType.LEADER,
      createdById,
      expiresAt: generateExpiryDate(),

      departments: {
        create: departmentIds.map((departmentId) => ({
          departmentId,
        })),
      },

      pendingLeader: {
        create: {
          fullName: "",
          username: "",
          phone: null,
          password: null,

          departments: {
            create: departmentIds.map((departmentId) => ({
              departmentId,
            })),
          },
        },
      },
    },
    include: {
      pendingLeader: true,
    },
  });

  return {
    success: true,
    inviteLink: `${process.env.NEXTAUTH_URL}/invite/leader/${token}`,
    invite,
  };
}