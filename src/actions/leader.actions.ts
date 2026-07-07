"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Prisma, UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

type ActionResult = {
  error?: string;
  success?: string;
};

export async function createLeader(formData: FormData): Promise<ActionResult> {
  const fullName = formData.get("fullName")?.toString().trim();
  const username = formData.get("username")?.toString().trim().toLowerCase();
  const phone = formData.get("phone")?.toString().trim();
  const password = formData.get("password")?.toString();
  const departmentId = formData.get("departmentId")?.toString();

  if (!fullName || !username || !phone || !departmentId) {
    return { error: "Please fill in all required fields." };
  }

  if (!/^\d{7,15}$/.test(phone)) {
    return {
      error: "Phone number must contain only numbers and must be 7 to 15 digits.",
    };
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const departmentAlreadyHasLeader = await tx.leaderDepartment.findFirst({
        where: { departmentId },
        include: { user: true },
      });

      if (departmentAlreadyHasLeader) {
        return {
          error: `${departmentAlreadyHasLeader.user.fullName} is already leading this department.`,
        };
      }

      let worker = await tx.worker.findUnique({
        where: { phone },
      });

      if (!worker) {
        worker = await tx.worker.create({
          data: {
            fullName,
            phone,
            departments: {
              create: { departmentId },
            },
          },
        });
      } else {
        worker = await tx.worker.update({
          where: { id: worker.id },
          data: {
            fullName,
            isActive: true,
          },
        });

        await tx.workerDepartment.createMany({
          data: [{ workerId: worker.id, departmentId }],
          skipDuplicates: true,
        });
      }

      let user = await tx.user.findFirst({
        where: {
          role: UserRole.DEPARTMENT_LEADER,
          workerId: worker.id,
        },
      });

      if (!user) {
        if (!password || password.length < 8) {
          return { error: "Password must be at least 8 characters." };
        }

        const existingUsername = await tx.user.findUnique({
          where: { username },
        });

        if (existingUsername) {
          return { error: "This username is already in use." };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user = await tx.user.create({
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
        user = await tx.user.update({
          where: { id: user.id },
          data: {
            fullName,
            isActive: true,
            departmentId: user.departmentId || departmentId,
          },
        });
      }

      await tx.leaderDepartment.create({
        data: {
          userId: user.id,
          departmentId,
        },
      });

      await tx.activityLog.create({
        data: {
          action: "CREATE_LEADER",
          description: `${fullName} was added as leader.`,
        },
      });

      return { success: "Leader added successfully." };
    });

    revalidatePath("/leaders");
    revalidatePath("/workers");
    revalidatePath("/dashboard");

    return result;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        error: "This department already has a leader assigned.",
      };
    }

    return {
      error: "Something went wrong while adding leader.",
    };
  }
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
    data: { password: hashedPassword },
  });

  await prisma.activityLog.create({
    data: {
      action: "RESET_LEADER_PASSWORD",
      description: `${leader.fullName}'s password was reset.`,
    },
  });

  revalidatePath(`/leaders/${leaderId}`);
}