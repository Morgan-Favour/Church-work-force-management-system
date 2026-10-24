
"use server";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { AttendanceStatus, UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createService(formData: FormData) {
  const title = formData.get("title")?.toString().trim();
  const date = formData.get("date")?.toString();

  if (!title || !date) {
    redirect("/attendance?message=gathering-missing-fields");
  }

  const serviceDate = new Date(date);

  if (Number.isNaN(serviceDate.getTime())) {
    redirect("/attendance?message=gathering-missing-fields");
  }

  let destination = "/attendance?message=connection-error";

  try {
    // Check all gatherings, including archived ones, because
    // title and date have a unique constraint in the database.
    const existingService = await prisma.service.findFirst({
      where: {
        title,
        date: serviceDate,
      },
    });

    if (existingService) {
      destination = `/attendance?serviceId=${existingService.id}&message=gathering-exists`;
    } else {
      const service = await prisma.service.create({
        data: {
          title,
          date: serviceDate,
          isActive: true,
          archivedAt: null,
        },
      });

      await prisma.activityLog.create({
        data: {
          action: "CREATE_GATHERING",
          description: `${title} gathering was created.`,
        },
      });

      destination = `/attendance?serviceId=${service.id}&message=gathering-created`;
    }
  } catch {
    redirect("/attendance?message=connection-error");
  }

  revalidatePath("/attendance");
  revalidatePath("/attendance/history");
  revalidatePath("/dashboard");

  redirect(destination);
}

export async function toggleGatheringStatus(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== UserRole.ADMIN) {
    redirect("/attendance?message=unauthorized");
  }

  const serviceId = formData.get("serviceId")?.toString();
  const isActiveValue = formData.get("isActive")?.toString();

  if (
    !serviceId ||
    (isActiveValue !== "true" && isActiveValue !== "false")
  ) {
    redirect("/attendance?message=gathering-invalid");
  }

  const isActive = isActiveValue === "true";

  let service;

  try {
    service = await prisma.service.findUnique({
      where: { id: serviceId },
      select: {
        id: true,
        title: true,
      },
    });
  } catch {
    redirect("/attendance?message=connection-error");
  }

  if (!service) {
    redirect("/attendance?message=gathering-not-found");
  }

  try {
    await prisma.service.update({
      where: { id: serviceId },
      data: {
        isActive,
        // Restore a gathering previously archived by the old cron.
        archivedAt: isActive ? null : undefined,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: isActive
          ? "ACTIVATE_GATHERING"
          : "DEACTIVATE_GATHERING",
        description: `${service.title} gathering was ${
          isActive ? "activated" : "deactivated"
        }.`,
        actorId: session.user.id,
      },
    });
  } catch {
    redirect("/attendance?message=connection-error");
  }

  revalidatePath("/attendance");
  revalidatePath("/attendance/history");
  revalidatePath("/dashboard");

  redirect(
    `/attendance?message=${
      isActive ? "gathering-activated" : "gathering-deactivated"
    }`
  );
}

export async function markAttendance(formData: FormData) {
  const serviceId = formData.get("serviceId")?.toString();
  const departmentId = formData.get("departmentId")?.toString();
  const markedBy = formData.get("markedBy")?.toString();
  const workerIds = formData.getAll("workerIds").map(String);

  if (!serviceId || !departmentId || workerIds.length === 0) {
    redirect("/attendance?message=attendance-missing-fields");
  }

  let service;

  try {
    service = await prisma.service.findUnique({
      where: { id: serviceId },
      select: {
        id: true,
        title: true,
        isActive: true,
        archivedAt: true,
      },
    });
  } catch {
    redirect(
      `/attendance?serviceId=${serviceId}&departmentId=${departmentId}&message=connection-error`
    );
  }

  if (!service || service.archivedAt !== null) {
    redirect("/attendance?message=gathering-not-found");
  }

  if (!service.isActive) {
    redirect(
      `/attendance?serviceId=${serviceId}&departmentId=${departmentId}&message=gathering-inactive`
    );
  }

  try {
    for (const workerId of workerIds) {
      const status = formData
        .get(`status-${workerId}`)
        ?.toString() as AttendanceStatus | undefined;

      if (!status || !Object.values(AttendanceStatus).includes(status)) {
        continue;
      }

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

    const department = await prisma.department.findUnique({
      where: { id: departmentId },
    });

    await prisma.activityLog.create({
      data: {
        action: "MARK_ATTENDANCE",
        description: `Attendance marked for ${
          department?.name || "a department"
        } during ${service.title}.`,
        actorId: markedBy || null,
        departmentId,
      },
    });
  } catch {
    redirect(
      `/attendance?serviceId=${serviceId}&departmentId=${departmentId}&message=connection-error`
    );
  }

  revalidatePath("/attendance");
  revalidatePath("/attendance/history");
  revalidatePath("/dashboard");

  redirect(`/attendance?serviceId=${serviceId}&departmentId=${departmentId}`);
}
