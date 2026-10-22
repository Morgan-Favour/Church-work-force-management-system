
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { UserRole, Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import {
  CalendarDays,
  ChevronRight,
  ClipboardCheck,
  Search,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";

type AttendanceHistoryPageProps = {
  searchParams: Promise<{ date?: string }>;
};

export default async function AttendanceHistoryPage({
  searchParams,
}: AttendanceHistoryPageProps) {
  const params = await searchParams;
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect("/login");

  const isAdmin = session.user.role === UserRole.ADMIN;
  const departmentIds = session.user.departmentIds ?? [];
  const selectedDate = params.date?.trim() ?? "";

  // Validate the date before using it in the database query.
  const isValidDate =
    /^\d{4}-\d{2}-\d{2}$/.test(selectedDate) &&
    !Number.isNaN(Date.parse(`${selectedDate}T00:00:00.000Z`)) &&
    new Date(`${selectedDate}T00:00:00.000Z`)
      .toISOString()
      .startsWith(selectedDate);

  const where: Prisma.ServiceWhereInput = {
    ...(isValidDate
      ? {
        date: {
          gte: new Date(`${selectedDate}T00:00:00.000Z`),
          lt: new Date(
            new Date(`${selectedDate}T00:00:00.000Z`).getTime() +
            24 * 60 * 60 * 1000
          ),
        },
      }
      : {}),
    ...(!isAdmin
      ? {
        attendance: {
          some: {
            departmentId: {
              in: departmentIds,
            },
          },
        },
      }
      : {}),
  };

  const services = await prisma.service.findMany({
    where,
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
        },
      },
    },
    orderBy: [{ date: "desc" }, { title: "asc" }],
  });

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-NG", {
      timeZone: "Africa/Lagos",
      weekday: "short",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Attendance History"
        description={
          isAdmin
            ? "Browse gatherings and review attendance across all departments."
            : "Browse gatherings and review attendance for your departments."
        }
      />

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Search size={20} />
          </div>

          <div>
            <h2 className="font-bold text-card-foreground">
              Find a Gathering
            </h2>
            <p className="text-sm text-muted-foreground">
              Filter attendance history by service date.
            </p>
          </div>
        </div>

        <form
          method="GET"
          action="/attendance/history"
          className="mt-5 flex flex-col gap-3 sm:flex-row"
        >
          <input
            type="date"
            name="date"
            aria-label="Filter gatherings by date"
            defaultValue={isValidDate ? selectedDate : ""}
            className="min-h-11 min-w-0 flex-1 rounded-xl border border-input bg-background px-4 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          />

          <button
            type="submit"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Search size={16} />
            Search
          </button>

          <Link
            href="/attendance/history"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border px-5 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            Clear
          </Link>
        </form>
      </section>

      <section className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Gatherings
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {services.length} gathering(s) found
              {isValidDate ? ` for ${selectedDate}` : ""}.
            </p>
          </div>
        </div>

        {services.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
            <CalendarDays
              size={32}
              className="mx-auto text-muted-foreground"
            />
            <h3 className="mt-4 font-semibold text-card-foreground">
              No gatherings found
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Try another date or check back after a gathering has been created.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <Link
                key={service.id}
                href={`/attendance/history/${service.id}`}
                className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/50 hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <CalendarDays size={21} />
                  </div>

                  <ChevronRight
                    size={20}
                    className="text-muted-foreground transition-transform group-hover:translate-x-1"
                  />
                </div>

                <h3 className="mt-4 text-lg font-bold text-card-foreground">
                  {service.title}
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  {formatDate(service.date)}
                </p>

                <div className="mt-5 flex items-center gap-2 border-t border-border pt-4">
                  <ClipboardCheck
                    size={17}
                    className="text-muted-foreground"
                  />
                  <span className="text-sm text-muted-foreground">
                    {service.attendance.length} attendance record(s)
                  </span>
                </div>

                <p className="mt-4 text-sm font-semibold text-primary">
                  View attendance details
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
