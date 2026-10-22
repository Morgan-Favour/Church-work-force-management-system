
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { UserRole } from "@prisma/client";
import {
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  ClipboardCheck,
  Users,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { PageHeader } from "@/components/ui/page-header";

type GatheringDetailsPageProps = {
  params: Promise<{ serviceId: string }>;
};

const statusLabels = [
  { value: "PRESENT", label: "Present" },
  { value: "ABSENT", label: "Absent" },
  { value: "LATE", label: "Late" },
  { value: "EXCUSED", label: "Excused" },
] as const;

export default async function GatheringDetailsPage({
  params,
}: GatheringDetailsPageProps) {
  const { serviceId } = await params;

  const session = await getServerSession(authOptions);

  if (!session?.user) redirect("/login");

  const isAdmin = session.user.role === UserRole.ADMIN;
  const departmentIds = session.user.departmentIds ?? [];

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    include: {
      attendance: {
        where: isAdmin
          ? undefined
          : {
              departmentId: {
                in: departmentIds,
              },
            },
        select: {
          id: true,
          departmentId: true,
          status: true,
        },
      },
    },
  });

  if (!service) notFound();

  const departments = await prisma.department.findMany({
    where: isAdmin
      ? {}
      : {
          id: {
            in: departmentIds,
          },
        },
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  const attendanceByDepartment = new Map<
    string,
    {
      total: number;
      statuses: Record<string, number>;
    }
  >();

  for (const record of service.attendance) {
    const current = attendanceByDepartment.get(record.departmentId) ?? {
      total: 0,
      statuses: {},
    };

    current.total += 1;
    current.statuses[record.status] =
      (current.statuses[record.status] ?? 0) + 1;

    attendanceByDepartment.set(record.departmentId, current);
  }

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-NG", {
      timeZone: "Africa/Lagos",
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const totalRecords = service.attendance.length;

  const overallCounts = statusLabels.map((status) => ({
    ...status,
    count: service.attendance.filter(
      (record) => record.status === status.value
    ).length,
  }));

  return (
    <div className="space-y-8">
      <Link
        href="/attendance/history"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={17} />
        Back to Attendance History
      </Link>

      <PageHeader
        title={service.title}
        description="Review attendance summaries for each department at this gathering."
      />

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CalendarDays size={23} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm text-muted-foreground">
              Gathering date
            </p>
            <h2 className="mt-1 text-lg font-bold text-card-foreground">
              {formatDate(service.date)}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {departments.length} department(s) · {totalRecords} attendance
              record(s)
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {overallCounts.map((status) => (
            <div
              key={status.value}
              className="rounded-xl border border-border bg-background p-4"
            >
              <p className="text-sm text-muted-foreground">
                {status.label}
              </p>
              <p className="mt-2 text-2xl font-bold text-foreground">
                {status.count}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Department Summaries
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Select a department to view its individual attendance records.
          </p>
        </div>

        {departments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <Users
              size={32}
              className="mx-auto text-muted-foreground"
            />
            <h3 className="mt-4 font-semibold text-card-foreground">
              No departments available
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              There are no departments available for your account.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {departments.map((department) => {
              const summary = attendanceByDepartment.get(department.id) ?? {
                total: 0,
                statuses: {},
              };

              return (
                <Link
                  key={department.id}
                  href={`/attendance/history/${service.id}/${department.id}`}
                  className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/50 hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Users size={21} />
                      </div>

                      <div>
                        <h3 className="font-bold text-card-foreground">
                          {department.name}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {summary.total} attendance record(s)
                        </p>
                      </div>
                    </div>

                    <ChevronRight
                      size={20}
                      className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1"
                    />
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {statusLabels.map((status) => (
                      <div
                        key={status.value}
                        className="rounded-lg bg-muted/60 px-3 py-3"
                      >
                        <p className="text-xs text-muted-foreground">
                          {status.label}
                        </p>
                        <p className="mt-1 text-lg font-bold text-foreground">
                          {summary.statuses[status.value] ?? 0}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center gap-2 border-t border-border pt-4 text-sm font-semibold text-primary">
                    <ClipboardCheck size={16} />
                    View department attendance
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
