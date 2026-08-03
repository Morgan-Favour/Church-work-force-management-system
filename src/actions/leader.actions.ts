"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Prisma, UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { generateInviteToken, generateExpiryDate } from "@/lib/invite";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { approveLeaderService, rejectLeaderService, registerLeaderService, createLeaderInviteService } from "@/services/leader";

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

  if(/^[a-zA-Z\s-]+$/.test(fullName) === false) {
    return {
      error: "Full name can only contain letters, spaces, and hyphens.",
    };
  }
  
  if (!/^\d{11,15}$/.test(phone)) {
    return {
      error: "Phone number must contain only numbers and must be 11 to 15 digits.",
    };
  }
  const departmentAlreadyHasLeader = await prisma.leaderDepartment.findFirst({
    where: { departmentId },
    include: { user: true },
  });

  if (departmentAlreadyHasLeader) {
    return {
      error: `${departmentAlreadyHasLeader.user.fullName} is already leading this department.`,
    };
  }

  const existingUsername = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUsername) {
    return {
      error: "This username is already in use.",
    };
  }

  if (!password || password.length < 8) {
    return {
      error: "Password must be at least 8 characters.",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const result = await prisma.$transaction(async (tx) => {
      let worker = await tx.worker.findUnique({
        where: {
          phone,
        },
      });

      if (!worker) {
        worker = await tx.worker.create({
          data: {
            fullName,
            phone,
            departments: {
              create: {
                departmentId,
              },
            },
          },
        });
      } else {
        worker = await tx.worker.update({
          where: {
            id: worker.id,
          },
          data: {
            fullName,
            isActive: true,
          },
        });

        await tx.workerDepartment.createMany({
          data: [
            {
              workerId: worker.id,
              departmentId,
            },
          ],
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
        user = await tx.user.create({
          data: {
            fullName,
            username,
            password: hashedPassword,
            role: UserRole.DEPARTMENT_LEADER,
            workerId: worker.id,
            departmentId,
          },
        });
      }

      await tx.leaderDepartment.create({
        data: {
          userId: user.id,
          departmentId,
        },
      });

      return {
        success: "Leader added successfully.",
      };
    });

    revalidatePath("/leaders");
    revalidatePath("/workers");
    revalidatePath("/dashboard");

    return result;
  } catch (error) {
    console.error(error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        error: "This department already has a leader assigned.",
      };
    }

    return {
      error:
        error instanceof Error
          ? error.message
          : "Something went wrong while adding leader.",
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

export async function resetLeaderPassword(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const leaderId = formData.get("leaderId")?.toString();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();

  if (!leaderId) {
    return {
      error: "Leader not found.",
    };
  }

  if (!password || !confirmPassword) {
    return {
      error: "Please fill in all fields.",
    };
  }

  if (password !== confirmPassword) {
    return {
      error: "Passwords do not match.",
    };
  }

  if (password.length < 8) {
    return {
      error: "Password must be at least 8 characters.",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const leader = await prisma.user.update({
    where: {
      id: leaderId,
    },
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

  return {
    success: "Password reset successfully.",
  };
}

export async function createLeaderInvite(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (
    !session ||
    ![
      UserRole.ADMIN,
      UserRole.DEPARTMENT_LEADER,
    ].includes(session.user.role)
  ) {
    return {
      error: "Unauthorized",
    };
  }

  const departmentIds = formData.getAll("departmentIds").map(String);

  console.log("Leader departments:", departmentIds);

  if (departmentIds.length === 0) {
    return {
      error: "Select at least one department.",
    };
  }

  // Department Leaders can only invite into departments they lead
  if (session.user.role === UserRole.DEPARTMENT_LEADER) {
    const allowedDepartments = session.user.departmentIds ?? [];

    const invalidDepartment = departmentIds.find(
      (id) => !allowedDepartments.includes(id)
    );

    if (invalidDepartment) {
      return {
        error: "You can only invite leaders into departments you lead.",
      };
    }
  }

  return await createLeaderInviteService({
    createdById: session.user.id,
    departmentIds,
  });
}

export async function completeLeaderRegistration(formData: FormData) {
  const token = formData.get("token")?.toString() ?? "";
  const fullName = formData.get("fullName")?.toString() ?? "";
  const username = formData.get("username")?.toString() ?? "";
  const phone = formData.get("phone")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  await registerLeaderService({
    token,
    fullName,
    username,
    phone,
    password,
  });

  revalidatePath("/approvals");

  redirect("/invite/leader/success");
}

export async function approveLeader(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== UserRole.ADMIN) {
    throw new Error("Unauthorized");
  }

  const pendingLeaderId = formData.get("pendingLeaderId")?.toString();

  if (!pendingLeaderId) {
    throw new Error("Missing pendingLeaderId");
  }

  await approveLeaderService(pendingLeaderId);

  revalidatePath("/leaders");
  revalidatePath("/approvals");
  revalidatePath("/workers");
  revalidatePath("/dashboard");
}

export async function rejectLeader(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== UserRole.ADMIN) {
    throw new Error("Unauthorized");
  }

  const pendingLeaderId = formData.get("pendingLeaderId")?.toString();

  if (!pendingLeaderId) {
    throw new Error("Missing pendingLeaderId");
  }

  await rejectLeaderService(pendingLeaderId);

  revalidatePath("/approvals");
}