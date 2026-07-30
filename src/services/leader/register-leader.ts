import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-log";
import { validateInvite } from "@/lib/invite";

type RegisterLeaderInput = {
  token: string;
  fullName: string;
  username: string;
  phone: string;
  password: string;
};

export async function registerLeaderService({
  token,
  fullName,
  username,
  phone,
  password,
}: RegisterLeaderInput) {
  const result = await validateInvite(token);

  if (!result.valid || !result.invite) {
    throw new Error(result.message ?? "Invalid invite.");
  }

  const invite = result.invite;

  if (invite.type !== "LEADER") {
    throw new Error("Invalid invite.");
  }

  if (!invite.pendingLeader) {
    throw new Error("Pending registration not found.");
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      username: username.toLowerCase().trim(),
    },
  });

  if (existingUser) {
    throw new Error("Username already exists.");
  }

  const existingPending = await prisma.pendingLeader.findFirst({
    where: {
      username: username.toLowerCase().trim(),
      status: "PENDING",
      NOT: {
        id: invite.pendingLeader.id,
      },
    },
  });

  if (existingPending) {
    throw new Error("Username already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const pendingLeader = await prisma.pendingLeader.update({
    where: {
      id: invite.pendingLeader.id,
    },
    data: {
      fullName: fullName.trim(),
      username: username.toLowerCase().trim(),
      phone,
      password: hashedPassword,
    },
  });

  await logActivity(prisma, {
    action: "LEADER_REGISTRATION",
    description: `${pendingLeader.fullName} submitted registration.`,
  });

  return pendingLeader;
}