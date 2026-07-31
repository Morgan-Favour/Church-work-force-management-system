import { prisma } from "@/lib/prisma";
import { validateInvite } from "@/lib/invite";
import { logActivity } from "@/lib/activity-log";

type RegisterWorkerInput = {
  token: string;
  fullName: string;
  phone: string;
  gender?: string;
};

export async function registerWorkerService({
  token,
  fullName,
  phone,
  gender,
}: RegisterWorkerInput) {
  const result = await validateInvite(token);

  if (!result.valid || !result.invite) {
    throw new Error(result.message ?? "Invalid invite.");
  }

  const invite = result.invite;

  if (invite.type !== "WORKER") {
    throw new Error("Invalid invite.");
  }

  if (!invite.pendingWorker) {
    throw new Error("Pending worker not found.");
  }

  const existingWorker = await prisma.worker.findUnique({
    where: {
      phone,
    },
  });

  if (
    existingWorker &&
    existingWorker.id !== invite.pendingWorker.id
  ) {
    throw new Error("Phone number already exists.");
  }

  const pendingWorker = await prisma.pendingWorker.update({
    where: {
      id: invite.pendingWorker.id,
    },
    data: {
      fullName: fullName.trim(),
      phone,
      gender: gender || null,
    },
  });

  await logActivity(prisma, {
    action: "WORKER_REGISTRATION",
    description: `${pendingWorker.fullName} submitted registration.`,
  });

  return pendingWorker;
}