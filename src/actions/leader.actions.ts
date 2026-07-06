"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createLeader(formData: FormData) {
  const fullName = formData.get("fullName")?.toString().trim();
  const username = formData.get("username")?.toString().trim().toLowerCase();
  const phone = formData.get("phone")?.toString().trim();
  const password = formData.get("password")?.toString();
  const departmentId = formData.get("departmentId")?.toString();

  if (!fullName || !phone || !departmentId) return;

  let worker = await prisma.worker.findUnique({
    where: { phone },
  });

  if (!worker) {
    if (!username || !password || password.length < 8) return;

    worker = await prisma.worker.create({
      data: {
        fullName,
        phone,
        departments: {
          create: { departmentId },
        },
      },
    });
  } else {
    await prisma.worker.update({
      where: { id: worker.id },
      data: {
        isActive: true,
        fullName,
      },
    });

    await prisma.workerDepartment.createMany({
      data: [{ workerId: worker.id, departmentId }],
      skipDuplicates: true,
    });
  }

  let user = await prisma.user.findFirst({
    where: {
      role: UserRole.DEPARTMENT_LEADER,
      workerId: worker.id,
    },
  });

  if (!user) {
    if (!username || !password || password.length < 8) return;

    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUsername) return;

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await prisma.user.create({
      data: {
        fullName,
        username,
        password: hashedPassword,
        role: UserRole.DEPARTMENT_LEADER,
        departmentId,
        workerId: worker.id,
      },
    });
  } else {
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        isActive: true,
        fullName,
        departmentId: user.departmentId || departmentId,
      },
    });
  }

  await prisma.leaderDepartment.createMany({
    data: [{ userId: user.id, departmentId }],
    skipDuplicates: true,
  });

  await prisma.activityLog.create({
    data: {
      action: "CREATE_LEADER",
      description: `${fullName} was added as a leader.`,
    },
  });

  revalidatePath("/leaders");
  revalidatePath("/workers");
  revalidatePath("/dashboard");
}

export async function deactivateLeader(formData: FormData) {
  const leaderId = formData.get("leaderId")?.toString();

  if (!leaderId) return;

  const leader = await prisma.user.update({
    where: { id: leaderId },
    data: { isActive: false },
  });

  await prisma.activityLog.create({
    data: {
      action: "DEACTIVATE_LEADER",
      description: `${leader.fullName} was deactivated as a leader.`,
    },
  });

  revalidatePath("/leaders");
  revalidatePath(`/leaders/${leaderId}`);
  revalidatePath("/dashboard");
}

export async function reactivateLeader(formData: FormData) {
  const leaderId = formData.get("leaderId")?.toString();

  if (!leaderId) return;

  const leader = await prisma.user.update({
    where: { id: leaderId },
    data: { isActive: true },
  });

  await prisma.activityLog.create({
    data: {
      action: "REACTIVATE_LEADER",
      description: `${leader.fullName} was reactivated as a leader.`,
    },
  });

  revalidatePath("/leaders");
  revalidatePath(`/leaders/${leaderId}`);
  revalidatePath("/dashboard");
}

export async function resetLeaderPassword(formData: FormData) {
  const leaderId = formData.get("leaderId")?.toString();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();

  if (!leaderId || !password || !confirmPassword) return;
  if (password !== confirmPassword) return;
  if (password.length < 8) return;

  const hashedPassword = await bcrypt.hash(password, 10);

  const leader = await prisma.user.update({
    where: { id: leaderId },
    data: {
      password: hashedPassword,
    },
  });

  await prisma.activityLog.create({
    data: {
      action: "RESET_LEADER_PASSWORD",
      description: `${leader.fullName}'s password was reset.`,
    },
  });

  revalidatePath(`/leaders/${leaderId}`);
}