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