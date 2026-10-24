import { prisma } from "@/lib/prisma";
import { validateInvite } from "@/lib/invite";
import { logActivity } from "@/lib/activity-log";
import { ApprovalStatus } from "@prisma/client";

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

  const normalizedName = fullName.trim();
  const normalizedPhone = phone.trim();

  if (!normalizedName || !normalizedPhone) {
    throw new Error("Please provide your full name and phone number.");
  }

  if (invite.departments.length === 0) {
    throw new Error("This invite has no departments assigned.");
  }

  const existingWorker = await prisma.worker.findUnique({
    where: { phone: normalizedPhone },
  });

  if (existingWorker) {
    throw new Error("Phone number already exists.");
  }

  const existingPending = await prisma.pendingWorker.findFirst({
    where: {
      phone: normalizedPhone,
      status: ApprovalStatus.PENDING,
    },
  });

  if (existingPending) {
    throw new Error("This phone number already has a pending registration.");
  }

  const pendingWorker = await prisma.pendingWorker.create({
    data: {
      inviteId: invite.id,
      fullName: normalizedName,
      phone: normalizedPhone,
      gender: gender || null,
      departments: {
        create: invite.departments.map(({ departmentId }) => ({
          departmentId,
        })),
      },
    },
  });

  await logActivity(prisma, {
    action: "WORKER_REGISTRATION",
    description: `${pendingWorker.fullName} submitted registration.`,
  });

  return pendingWorker;
}
