"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createDepartment(formData: FormData) {
  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim();

  if (!name) return;

  const existingDepartment = await prisma.department.findFirst({
    where: { name },
  });

  if (existingDepartment) return;

  await prisma.department.create({
    data: {
      name,
      description: description || null,
    },
  });

  await prisma.activityLog.create({
    data: {
      action: "CREATE_DEPARTMENT",
      description: `${name} department was created.`,
    },
  });

  revalidatePath("/departments");
  revalidatePath("/dashboard");
}

export async function deactivateDepartment(formData: FormData) {
  const departmentIds = formData.get("departmentId")?.toString();

  if (!departmentIds)return;

  const department = await prisma.department.update({
    where: { id: departmentIds },
    data: { isActive: false },
  });

  await prisma.activityLog.create({
    data: {
      action: "DEACTIVATE_DEPARTMENT",
      description: `${department.name} department was deactivated.`,
    },
  });

  revalidatePath("/departments");
  revalidatePath("/dashboard");
}

export async function reactivateDepartment(formData: FormData) {
  const departmentIds = formData.get("departmentId")?.toString();

  if (!departmentIds) return;

  const department = await prisma.department.update({
    where: { id: departmentIds },
    data: { isActive: true },
  });

  await prisma.activityLog.create({
    data: {
      action: "REACTIVATE_DEPARTMENT",
      description: `${department.name} department was reactivated.`,
    },
  });

  revalidatePath("/departments");
  revalidatePath("/dashboard");
}