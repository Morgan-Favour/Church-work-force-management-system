import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { CreateGatheringForm } from "@/components/attendance/create-gathering-form";
import { AttendanceTable } from "@/components/attendance/attendance-table";
import AttendanceContextSelector from "./AttendanceContextSelector";

export default async function AttendancePage({
  searchParams,
}: {
  searchParams: Promise<{
    serviceId?: string;
    departmentId?: string;
    message?: string;
  }>;
}) {
  const params = await searchParams;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const isAdmin = session.user.role === UserRole.ADMIN;
  const leaderDepartmentIds = session.user.departmentIds || [];

  const services = await prisma.service.findMany({
    orderBy: { date: "desc" },
  });

  const departments = await prisma.department.findMany({
    where: isAdmin
      ? { isActive: true }
      : {
          id: { in: leaderDepartmentIds },
          isActive: true,
        },
    orderBy: { name: "asc" },
  });

  const selectedServiceId = params.serviceId || services[0]?.id;
  const selectedDepartmentId = params.departmentId || departments[0]?.id;

  const departmentStatuses = await Promise.all(
    departments.map(async (department) => {
      if (!selectedServiceId) {
        return {
          id: department.id,
          status: "Pending",
        };
      }

      const totalWorkers = await prisma.worker.count({
        where: {
          isActive: true,
          departments: {
            some: {
              departmentId: department.id,
            },
          },
        },
      });

      const markedCount = await prisma.attendance.count({
        where: {
          serviceId: selectedServiceId,
          departmentId: department.id,
        },
      });

      const status:
        | "Pending"
        | "No workers"
        | "Partial"
        | "Marked" =
        totalWorkers === 0
          ? "No workers"
          : markedCount === 0
            ? "Pending"
            : markedCount < totalWorkers
              ? "Partial"
              : "Marked";

      return {
        id: department.id,
        status,
      };
    })
  );

  const selectedDepartment = departments.find(
    (department) => department.id === selectedDepartmentId
  );

  const workers = selectedDepartmentId
    ? await prisma.worker.findMany({
        where: {
          isActive: true,
          departments: {
            some: {
              departmentId: selectedDepartmentId,
            },
          },
        },
        orderBy: { fullName: "asc" },
      })
    : [];

  const existingAttendance =
    selectedServiceId && selectedDepartmentId
      ? await prisma.attendance.findMany({
          where: {
            serviceId: selectedServiceId,
            departmentId: selectedDepartmentId,
          },
          select: {
            workerId: true,
            status: true,
          },
        })
      : [];

  const markedCount = existingAttendance.length;
  const totalWorkers = workers.length;

  const attendanceStatus =
    totalWorkers === 0
      ? "No workers"
      : markedCount === 0
        ? "Not marked"
        : markedCount < totalWorkers
          ? "Partially marked"
          : "Marked";

  const attendanceStatusClass =
    attendanceStatus === "Marked"
      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      : attendanceStatus === "Partially marked"
        ? "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400"
        : "border-border bg-muted/50 text-muted-foreground";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mark Attendance"
        description={
          isAdmin
            ? "Create gatherings and mark worker attendance by department."
            : "Mark attendance for the departments you lead."
        }
        action={
          <a
            href="/attendance/history"
            className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-card-foreground shadow-sm transition hover:bg-muted"
          >
            View History
          </a>
        }
      />

      {isAdmin && <CreateGatheringForm message={params.message} />}

      <AttendanceContextSelector
        services={services.map((service) => ({
          id: service.id,
          title: service.title,
          date: service.date.toDateString(),
        }))}
        departments={departments.map((department) => {
          const departmentStatus = departmentStatuses.find(
            (item) => item.id === department.id
          );

          return {
            id: department.id,
            name: department.name,
            status: (departmentStatus?.status || "Pending") as "Pending" | "No workers" | "Partial" | "Marked",
          };
        })}
        selectedServiceId={selectedServiceId}
        selectedDepartmentId={selectedDepartmentId || ""}
        selectedDepartmentName={selectedDepartment?.name}
        attendanceStatus={attendanceStatus}
        attendanceStatusClass={attendanceStatusClass}
        markedCount={markedCount}
        totalWorkers={totalWorkers}
      />

      <AttendanceTable
        selectedServiceId={selectedServiceId}
        selectedDepartmentId={selectedDepartmentId}
        selectedDepartmentName={selectedDepartment?.name}
        markedBy={session.user.id}
        workers={workers}
        existingAttendance={existingAttendance}
      />
    </div>
  );
}