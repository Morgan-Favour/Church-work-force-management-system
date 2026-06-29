"use server";

import { prisma } from "@/lib/prisma";
import { AttendanceStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createService(formData: FormData) {
  const title = formData.get("title")?.toString().trim();
  const date = formData.get("date")?.toString();

  if (!title || !date) return;

  const serviceDate = new Date(date);

  const existingService = await prisma.service.findFirst({
    where: {
      title,
      date: serviceDate,
    },
  });

  if (existingService) return;

  await prisma.service.create({
    data: {
      title,
      date: serviceDate,
    },
  });

  await prisma.activityLog.create({
    data: {
      action: "CREATE_GATHERING",
      description: `${title} gathering was created.`,
    },
  });

  revalidatePath("/attendance");
  revalidatePath("/dashboard");
}

export async function markAttendance(formData: FormData) {
  const serviceId = formData.get("serviceId")?.toString();
  const departmentId = formData.get("departmentId")?.toString();
  const markedBy = formData.get("markedBy")?.toString();
  const workerIds = formData.getAll("workerIds").map(String);

  if (!serviceId || !departmentId || workerIds.length === 0) return;

  for (const workerId of workerIds) {
    const status = formData.get(`status-${workerId}`)?.toString() as
      | AttendanceStatus
      | undefined;

    if (!status) continue;

    await prisma.attendance.upsert({
      where: {
        workerId_serviceId_departmentId: {
          workerId,
          serviceId,
          departmentId,
        },
      },
      update: {
        status,
        markedBy: markedBy || null,
      },
      create: {
        workerId,
        serviceId,
        departmentId,
        status,
        markedBy: markedBy || null,
      },
    });
  }

  const service = await prisma.service.findUnique({
    where: {
      id: serviceId,
    },
  });

  const department = await prisma.department.findUnique({
    where: {
      id: departmentId,
    },
  });

  await prisma.activityLog.create({
    data: {
      action: "MARK_ATTENDANCE",
      description: `Attendance marked for ${
        department?.name || "a department"
      } during ${service?.title || "a gathering"}.`,
      actorId: markedBy || null,
    },
  });

  revalidatePath("/attendance");
  revalidatePath("/attendance/history");
  revalidatePath("/dashboard");

  redirect(`/attendance?serviceId=${serviceId}&departmentId=${departmentId}`);
}