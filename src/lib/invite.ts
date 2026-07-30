import crypto from "crypto";
import { prisma } from "@/lib/prisma";

const INVITE_EXPIRY_DAYS = 7;

export function generateInviteToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function generateExpiryDate(days = INVITE_EXPIRY_DAYS): Date {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + days);
  return expiry;
}

export async function validateInvite(token: string) {
  const invite = await prisma.invite.findUnique({
    where: {
      token,
    },
    include: {
      pendingLeader: {
        include: {
          departments: {
            include: {
              department: true,
            },
          },
        },
      },

      pendingWorker: {
        include: {
          departments: {
            include: {
              department: true,
            },
          },
        },
      },

      departments: {
        include: {
          department: true,
        },
      },
    },
  });

  if (!invite) {
    return {
      valid: false,
      message: "Invite not found.",
      invite: null,
    };
  }

  if (invite.used) {
    return {
      valid: false,
      message: "This invite has already been used.",
      invite: null,
    };
  }

  if (invite.expiresAt && invite.expiresAt < new Date()) {
    return {
      valid: false,
      message: "This invite has expired.",
      invite: null,
    };
  }

  if (
    invite.type === "LEADER" &&
    !invite.pendingLeader
  ) {
    return {
      valid: false,
      message: "Pending leader registration not found.",
      invite: null,
    };
  }

  if (
    invite.type === "WORKER" &&
    !invite.pendingWorker
  ) {
    return {
      valid: false,
      message: "Pending worker registration not found.",
      invite: null,
    };
  }

  return {
    valid: true,
    message: null,
    invite,
  };
}

export async function markInviteAsUsed(inviteId: string) {
  return prisma.invite.update({
    where: {
      id: inviteId,
    },
    data: {
      used: true,
    },
  });
}

export async function expireInvite(inviteId: string) {
  return prisma.invite.update({
    where: {
      id: inviteId,
    },
    data: {
      expiresAt: new Date(),
    },
  });
}