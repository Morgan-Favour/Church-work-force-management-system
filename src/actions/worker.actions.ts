"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createWorker(formData: FormData) {
  const fullName = formData.get("fullName")?.toString().trim();
  const phone = formData.get("phone")?.toString().trim();
  const gender = formData.get("gender")?.toString();
  const departmentIds = formData.getAll("departmentIds").map(String);

  if (!fullName || departmentIds.length === 0) return;

  const existingWorker = phone
    ? await prisma.worker.findUnique({
        where: { phone },
      })
    : null;

  if (existingWorker) {
    await prisma.worker.update({
      where: { id: existingWorker.id },
      data: { isActive: true },
    });

    await prisma.workerDepartment.createMany({
      data: departmentIds.map((departmentId) => ({
        workerId: existingWorker.id,
        departmentId,
      })),
      skipDuplicates: true,
    });

    await prisma.activityLog.create({
      data: {
        action: "UPDATE_WORKER_DEPARTMENTS",
        description: `${existingWorker.fullName} was assigned to another department.`,
      },
    });
  } else {
    await prisma.worker.create({
      data: {
        fullName,
        phone: phone || null,
        gender: gender || null,
        departments: {
          create: departmentIds.map((departmentId) => ({
            departmentId,
          })),
        },
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "CREATE_WORKER",
        description: `${fullName} was added as a worker.`,
      },
    });
  }

  revalidatePath("/workers");
  revalidatePath("/dashboard");
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