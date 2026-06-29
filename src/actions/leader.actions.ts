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

  if (!fullName || !username || !password || !departmentId) return;

  if (password.length < 8) return;

  const existingUser = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUser) return;

  const hashedPassword = await bcrypt.hash(password, 10);

  let worker = phone
    ? await prisma.worker.findUnique({
        where: { phone },
      })
    : null;

  if (worker) {
    await prisma.workerDepartment.createMany({
      data: [
        {
          workerId: worker.id,
          departmentId,
        },
      ],
      skipDuplicates: true,
    });
  } else {
    worker = await prisma.worker.create({
      data: {
        fullName,
        phone: phone || null,
        departments: {
          create: {
            departmentId,
          },
        },
      },
    });
  }

  await prisma.user.create({
    data: {
      fullName,
      username,
      password: hashedPassword,
      role: UserRole.DEPARTMENT_LEADER,
      departmentId,
      workerId: worker.id,
    },
  });

  await prisma.activityLog.create({
    data: {
      action: "CREATE_LEADER",
      description: `${fullName} was created as a department leader and linked as a worker.`,
    },
  });

  revalidatePath("/leaders");
  revalidatePath("/workers");
  revalidatePath("/dashboard");
}