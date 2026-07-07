import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft, UserRound } from "lucide-react";
import { EditWorkerModal } from "@/components/workers/edit-worker-modal";
export default async function WorkerDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const isAdmin = session.user.role === UserRole.ADMIN;

  const worker = await prisma.worker.findUnique({
    where: { id },
    include: {
      departments: {
        include: {
          department: true,
        },
      },
      attendance: {
        include: {
          service: true,
          department: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const availableDepartments = await prisma.department.findMany({
    where: isAdmin
      ? {
        isActive: true,
      }
      : {
        id: {
          in: session.user.departmentIds || [],
        },
        isActive: true,
      },
    orderBy: {
      name: "asc",
    },
  });

  if (!worker) {
    notFound();
  }

  if (!isAdmin) {
    const belongsToLeaderDepartment = worker.departments.some((item) =>
      session.user.departmentIds.includes(item.departmentId)
    );

    if (!belongsToLeaderDepartment) {
      redirect("/workers");
    }
  }

  const totalAttendance = worker.attendance.length;
  const presentCount = worker.attendance.filter(
    (item) => item.status === "PRESENT"
  ).length;
  const lateCount = worker.attendance.filter(
    (item) => item.status === "LATE"
  ).length;
  const absentCount = worker.attendance.filter(
    (item) => item.status === "ABSENT"
  ).length;
  const excusedCount = worker.attendance.filter(
    (item) => item.status === "EXCUSED"
  ).length;

  const attendanceRate =
    totalAttendance > 0
      ? Math.round(((presentCount + lateCount) / totalAttendance) * 100)
      : 0;

  return (
    <div className="space-y-8">
      <Link
        href="/workers"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#0e2d33]"
      >
        <ArrowLeft size={17} />
        Back to Workers
      </Link>

      <section className="rounded-3xl bg-[#0e2d33] p-8 text-white shadow-xl shadow-slate-300/40">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-[#d4af37]">
              <UserRound size={32} />
            </div>

            <div>
              <p className="text-sm font-medium text-[#d4af37]">
                Worker Profile
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight">
                {worker.fullName}
              </h1>
              <p className="mt-2 text-sm text-white/65">
                {worker.phone || "No phone number"} ·{" "}
                {worker.gender || "Gender not specified"}
              </p>

              <span
                className={
                  worker.isActive
                    ? "mt-4 inline-flex rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-200"
                    : "mt-4 inline-flex rounded-full bg-red-400/15 px-3 py-1 text-xs font-bold text-red-200"
                }
              >
                {worker.isActive ? "Active Worker" : "Inactive Worker"}
              </span>
              </div>
            </div>
            <EditWorkerModal worker={worker} departments={availableDepartments} />
          </div>
          
      </section>

      <section className="grid grid-cols-4 gap-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Attendance Rate
          </p>
          <h2 className="mt-5 text-4xl font-bold text-slate-900">
            {attendanceRate}%
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Present</p>
          <h2 className="mt-5 text-4xl font-bold text-slate-900">
            {presentCount}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Late</p>
          <h2 className="mt-5 text-4xl font-bold text-slate-900">
            {lateCount}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Absent</p>
          <h2 className="mt-5 text-4xl font-bold text-slate-900">
            {absentCount}
          </h2>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Departments</h2>

          <div className="mt-5 flex flex-wrap gap-2">
            {worker.departments.map((item) => (
              <span
                key={item.id}
                className="rounded-full bg-[#0e2d33]/10 px-3 py-1 text-xs font-bold text-[#0e2d33]"
              >
                {item.department.name}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-900">
            Attendance History
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Showing latest attendance records for this worker.
          </p>

          {worker.attendance.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-8 text-center">
              <p className="font-semibold text-slate-700">
                No attendance records yet
              </p>
            </div>
          ) : (
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Gathering</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 bg-white">
                  {worker.attendance.map((record) => (
                    <tr key={record.id}>
                      <td className="px-4 py-4 font-semibold text-slate-900">
                        {record.service.title}
                      </td>

                      <td className="px-4 py-4 text-slate-600">
                        {record.department.name}
                      </td>

                      <td className="px-4 py-4 text-slate-600">
                        {record.service.date.toDateString()}
                      </td>

                      <td className="px-4 py-4">
                        <span className="rounded-full bg-[#0e2d33]/10 px-3 py-1 text-xs font-bold text-[#0e2d33]">
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <p className="text-sm text-slate-400">
        Joined: {worker.joinedAt.toDateString()}
      </p>

    </div>
  );
}