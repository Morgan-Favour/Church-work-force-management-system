"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type ActionResult = {
  error?: string;
  success?: string;
};

export async function createDepartment(
  formData: FormData
): Promise<ActionResult> {
  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim();

  if (!name) {
    return { error: "Department name is required." };
  }

  try {
    const existingDepartment = await prisma.department.findFirst({
      where: { name },
    });

    if (existingDepartment) {
      return { error: "This department already exists." };
    }

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

    return { success: "Department created successfully." };
  } catch {
    return {
      error:
        "Could not connect to the database. Please check your internet connection and try again.",
    };
  }
}

export async function deactivateDepartment(formData: FormData) {
  const departmentId = formData.get("departmentId")?.toString();
  if (!departmentId) return;

  const department = await prisma.department.update({
    where: { id: departmentId },
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
  const departmentId = formData.get("departmentId")?.toString();
  if (!departmentId) return;

  const department = await prisma.department.update({
    where: { id: departmentId },
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