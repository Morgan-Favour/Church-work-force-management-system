"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserRole } from "@prisma/client";

type ActionResult = {
  error?: string;
  success?: string;
};

export async function createWorker(formData: FormData): Promise<ActionResult> {
  const fullName = formData.get("fullName")?.toString().trim();
  const phone = formData.get("phone")?.toString().trim();
  const gender = formData.get("gender")?.toString();
  const departmentIds = formData.getAll("departmentIds").map(String);

  if (!fullName || !phone || departmentIds.length === 0) {
    return {
      error: "Please enter worker name, phone number, and select at least one department.",
    };
  }

  if (!/^\d{7,15}$/.test(phone)) {
    return {
      error: "Phone number must contain only numbers and must be 7 to 15 digits.",
    };
  }

  try {
    const existingWorker = await prisma.worker.findUnique({
      where: { phone },
    });

    if (existingWorker) {
      return {
        error: `${existingWorker.fullName} already exists with this phone number. Open their profile to edit or assign departments.`,
      };
    }

    await prisma.worker.create({
      data: {
        fullName,
        phone,
        gender: gender || null,
        departments: {
          create: departmentIds.map((departmentId) => ({ departmentId })),
        },
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "CREATE_WORKER",
        description: `${fullName} was added as a worker.`,
        departmentId: departmentIds[0],
      },
    });

    revalidatePath("/workers");
    revalidatePath("/dashboard");

    return { success: "Worker added successfully." };
  } catch {
    return {
      error: "Could not save worker. Please check your internet connection and try again.",
    };
  }
}

export async function deactivateWorker(formData: FormData) {
  const workerId = formData.get("workerId")?.toString();
  if (!workerId) return;

  const worker = await prisma.worker.update({
    where: { id: workerId },
    data: { isActive: false },
  });

  await prisma.activityLog.create({
    data: {
      action: "DEACTIVATE_WORKER",
      description: `${worker.fullName} was deactivated as a worker.`,
    },
  });

  revalidatePath("/workers");
  revalidatePath("/dashboard");
}

export async function reactivateWorker(formData: FormData) {
  const workerId = formData.get("workerId")?.toString();
  if (!workerId) return;

  const worker = await prisma.worker.update({
    where: { id: workerId },
    data: { isActive: true },
  });

  await prisma.activityLog.create({
    data: {
      action: "REACTIVATE_WORKER",
      description: `${worker.fullName} was reactivated as a worker.`,
    },
  });

  revalidatePath("/workers");
  revalidatePath(`/workers/${workerId}`);
  revalidatePath("/dashboard");
}

export async function updateWorker(formData: FormData): Promise<ActionResult> {
  const session = await getServerSession(authOptions);

  if (!session) {
    return { error: "You must be logged in to update a worker." };
  }

  const workerId = formData.get("workerId")?.toString();
  const fullName = formData.get("fullName")?.toString().trim();
  const phone = formData.get("phone")?.toString().trim();
  const gender = formData.get("gender")?.toString();
  const departmentIds = formData.getAll("departmentIds").map(String);

  if (!workerId || !fullName || !phone || departmentIds.length === 0) {
    return { error: "Please fill in all required fields." };
  }

  if (!/^\d{7,15}$/.test(phone)) {
    return {
      error: "Phone number must contain only numbers and must be 7 to 15 digits.",
    };
  }

  const isAdmin = session.user.role === UserRole.ADMIN;

  if (!isAdmin) {
    const allowedDepartmentIds = session.user.departmentIds || [];

    const isTryingInvalidDepartment = departmentIds.some(
      (id) => !allowedDepartmentIds.includes(id)
    );

    if (isTryingInvalidDepartment) {
      return { error: "You can only assign workers to departments you lead." };
    }
  }

  try {
    const existingPhoneOwner = await prisma.worker.findUnique({
      where: { phone },
    });

    if (existingPhoneOwner && existingPhoneOwner.id !== workerId) {
      return {
        error: `${existingPhoneOwner.fullName} already uses this phone number.`,
      };
    }

    const worker = await prisma.worker.update({
      where: { id: workerId },
      data: {
        fullName,
        phone,
        gender: gender || null,
      },
    });

    await prisma.workerDepartment.deleteMany({
      where: isAdmin
        ? { workerId }
        : {
            workerId,
            departmentId: {
              in: session.user.departmentIds || [],
            },
          },
    });

    await prisma.workerDepartment.createMany({
      data: departmentIds.map((departmentId) => ({
        workerId,
        departmentId,
      })),
      skipDuplicates: true,
    });

    await prisma.activityLog.create({
      data: {
        action: "UPDATE_WORKER",
        description: `${worker.fullName}'s profile was updated.`,
        departmentId: departmentIds[0],
      },
    });

    revalidatePath("/workers");
    revalidatePath(`/workers/${workerId}`);
    revalidatePath("/dashboard");

    return { success: "Worker updated successfully." };
  } catch {
    return {
      error: "Could not update worker. Please check your internet connection and try again.",
    };
  }
}