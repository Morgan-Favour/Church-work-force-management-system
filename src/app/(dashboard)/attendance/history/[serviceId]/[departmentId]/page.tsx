
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { AttendanceStatus, UserRole } from "@prisma/client";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  ClipboardCheck,
  Users,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { PageHeader } from "@/components/ui/page-header";

type DepartmentAttendancePageProps = {
  params: Promise<{
    serviceId: string;
    departmentId: string;
  }>;
  searchParams: Promise<{
    status?: string;
  }>;
};

const statusOptions: {
  value: AttendanceStatus | "ALL";
  label: string;
}[] = [
  { value: "ALL", label: "All" },
  { value: AttendanceStatus.PRESENT, label: "Present" },
  { value: AttendanceStatus.ABSENT, label: "Absent" },
  { value: AttendanceStatus.LATE, label: "Late" },
  { value: AttendanceStatus.EXCUSED, label: "Excused" },
];

export default async function DepartmentAttendancePage({
  params,
  searchParams,
}: DepartmentAttendancePageProps) {
  const { serviceId, departmentId } = await params;
  const query = await searchParams;

  const session = await getServerSession(authOptions);

  if (!session?.user) redirect("/login");

  const isAdmin = session.user.role === UserRole.ADMIN;
  const departmentIds = session.user.departmentIds ?? [];

  // Department leaders may only access their assigned departments.
  if (!isAdmin && !departmentIds.includes(departmentId)) {
    notFound();
  }

  const [service, department] = await Promise.all([
    prisma.service.findUnique({
      where: { id: serviceId },
      select: {
        id: true,
        title: true,
        date: true,
      },
    }),
    prisma.department.findUnique({
      where: { id: departmentId },
      select: {
        id: true,
        name: true,
      },
    }),
  ]);

  if (!service || !department) notFound();

  const records = await prisma.attendance.findMany({
    where: {
      serviceId,
      departmentId,
    },
    include: {
      worker: {
        select: {
          id: true,
          fullName: true,
        },
      },
    },
    orderBy: {
      worker: {
        fullName: "asc",
      },
    },
  });

  const selectedStatus = statusOptions.some(
    (option) => option.value === query.status
  )
    ? query.status!
    : "ALL";

  const summary = statusOptions
    .filter((option) => option.value !== "ALL")
    .map((option) => ({
      ...option,
      count: records.filter(
        (record) => record.status === option.value
      ).length,
    }));

  const filteredRecords =
    selectedStatus === "ALL"
      ? records
      : records.filter(
          (record) => record.status === selectedStatus
        );

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-NG", {
      timeZone: "Africa/Lagos",
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const formatDateTime = (date: Date) =>
    date.toLocaleString("en-NG", {
      timeZone: "Africa/Lagos",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  const statusStyles: Record<AttendanceStatus, string> = {
    [AttendanceStatus.PRESENT]:
      "bg-primary/10 text-primary",
    [AttendanceStatus.ABSENT]:
      "bg-destructive/10 text-destructive",
    [AttendanceStatus.LATE]:
      "bg-secondary text-secondary-foreground",
    [AttendanceStatus.EXCUSED]:
      "bg-muted text-muted-foreground",
  };

  const statusLabel = (status: AttendanceStatus) =>
    statusOptions.find((option) => option.value === status)?.label ??
    status;

  return (
    <div className="space-y-8">
      <Link
        href={`/attendance/history/${service.id}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={17} />
        Back to Gathering
      </Link>

      <PageHeader
        title={`${department.name} Attendance`}
        description={`Review attendance records for ${department.name} at ${service.title}.`}
      />

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CalendarDays size={21} />
          </div>

          <div className="min-w-0">
            <h2 className="font-bold text-card-foreground">
              {service.title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatDate(service.date)}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {department.name} Department
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {summary.map((item) => (
            <div
              key={item.value}
              className="rounded-xl border border-border bg-background p-4"
            >
              <p className="text-sm text-muted-foreground">
                {item.label}
              </p>
              <p className="mt-2 text-2xl font-bold text-foreground">
                {item.count}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <ClipboardCheck size={17} />
          {records.length} total attendance record(s)
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Workers
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Filter the records by attendance status.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => {
            const isSelected = selectedStatus === option.value;

            return (
              <Link
                key={option.value}
                href={
                  option.value === "ALL"
                    ? `/attendance/history/${serviceId}/${departmentId}`
                    : `/attendance/history/${serviceId}/${departmentId}?status=${option.value}`
                }
                aria-current={isSelected ? "page" : undefined}
                className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors ${
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-card-foreground hover:bg-muted"
                }`}
              >
                {option.label}
                {option.value !== "ALL" && (
                  <span className="ml-2 opacity-80">
                    {summary.find(
                      (item) => item.value === option.value
                    )?.count ?? 0}
                  </span>
                )}
                {option.value === "ALL" && (
                  <span className="ml-2 opacity-80">
                    {records.length}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {filteredRecords.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <Users
              size={32}
              className="mx-auto text-muted-foreground"
            />
            <h3 className="mt-4 font-semibold text-card-foreground">
              No records found
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {records.length === 0
                ? "No attendance has been recorded for this department at this gathering."
                : `There are no ${selectedStatus.toLowerCase()} records for this department at this gathering.`}
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
              <p className="text-sm text-muted-foreground">
                Showing {filteredRecords.length} of {records.length} record(s)
              </p>
              <Users
                size={18}
                className="text-muted-foreground"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-5 py-4">Worker</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Marked On</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {filteredRecords.map((record) => (
                    <tr
                      key={record.id}
                      className="transition-colors hover:bg-muted/30"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                            <Users size={16} />
                          </div>
                          <span className="font-semibold text-card-foreground">
                            {record.worker.fullName}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[record.status]}`}
                        >
                          {record.status === AttendanceStatus.PRESENT && (
                            <CheckCircle2 size={13} />
                          )}
                          {record.status === AttendanceStatus.LATE && (
                            <Clock size={13} />
                          )}
                          {statusLabel(record.status)}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">
                        {formatDateTime(record.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
