import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";

export default async function AttendanceHistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const params = await searchParams;
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  const isAdmin = session.user.role === UserRole.ADMIN;
  const selectedDate = params.date;

  const where = {
    ...(isAdmin
      ? {}
      : {
          departmentId: {
            in: session.user.departmentIds || [],
          },
        }),

    ...(selectedDate
      ? {
          service: {
            date: {
              gte: new Date(`${selectedDate}T00:00:00.000Z`),
              lt: new Date(`${selectedDate}T23:59:59.999Z`),
            },
          },
        }
      : {}),
  };

  const records = await prisma.attendance.findMany({
    where,
    include: {
      worker: true,
      department: true,
      service: true,
    },
    orderBy: [
      { service: { date: "desc" } },
      { service: { title: "asc" } },
      { department: { name: "asc" } },
      { worker: { fullName: "asc" } },
    ],
  });

  const groupedRecords = records.reduce((groups, record) => {
    const dateKey = record.service.date.toDateString();
    const gatheringKey = `${record.service.title}__${record.department.name}`;

    if (!groups[dateKey]) groups[dateKey] = {};

    if (!groups[dateKey][gatheringKey]) {
      groups[dateKey][gatheringKey] = {
        serviceTitle: record.service.title,
        departmentName: record.department.name,
        records: [],
      };
    }

    groups[dateKey][gatheringKey].records.push(record);
    return groups;
  }, {} as Record<string, Record<string, {
    serviceTitle: string;
    departmentName: string;
    records: typeof records;
  }>>);

  return (
    <div className="space-y-8">
      <PageHeader
        title="View Attendance Records"
        description={
          isAdmin
            ? "View attendance records across all departments, grouped by date and gathering."
            : "View attendance records for your departments, grouped by date and gathering."
        }
      />

      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-bold text-card-foreground">Search Attendance</h2>

        <form
          method="GET"
          action="/attendance/history"
          className="mt-5 grid gap-4 md:grid-cols-[1fr_auto_auto]"
        >
          <input
            required
            type="date"
            name="date"
            defaultValue={selectedDate || ""}
            className="rounded-xl border border-border bg-input px-4 py-3 text-sm text-card-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
          />

          <button
            type="submit"
            className="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-colors hover:opacity-90"
          >
            Search Date
          </button>

          <a
            href="/attendance/history"
            className="rounded-xl border border-border px-5 py-3 text-center text-sm font-bold text-card-foreground transition-colors hover:bg-muted"
          >
            Clear
          </a>
        </form>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-card-foreground">
            Attendance Records
          </h2>

          <p className="text-sm text-muted-foreground">
            Showing {records.length} record(s)
            {selectedDate ? ` for ${selectedDate}` : ""}.
          </p>
        </div>

        {records.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center">
            <p className="font-semibold text-card-foreground">
              No attendance records found
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try another date or mark attendance first.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedRecords).map(([date, gatherings]) => (
              <div key={date} className="space-y-4">
                <div className="rounded-2xl bg-muted px-5 py-4">
                  <h3 className="text-lg font-bold text-card-foreground">{date}</h3>
                </div>

                {Object.entries(gatherings).map(([key, group]) => (
                  <div
                    key={key}
                    className="overflow-hidden rounded-2xl border border-border"
                  >
                    <div className="flex items-center justify-between border-b border-border bg-card px-5 py-4">
                      <div>
                        <h4 className="font-bold text-card-foreground">
                          {group.serviceTitle}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {group.departmentName} Department
                        </p>
                      </div>

                      <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
                        {group.records.length} record(s)
                      </span>
                    </div>

                    <div className="w-full overflow-x-auto">
                      <table className="w-full text-left text-sm border-collapse">
                        <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                          <tr>
                            <th className="px-4 py-3 whitespace-nowrap">Worker</th>
                            <th className="px-4 py-3 whitespace-nowrap">Status</th>
                            <th className="px-4 py-3 whitespace-nowrap">Marked On</th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-border bg-card">
                          {group.records.map((record) => (
                            <tr key={record.id} className="transition-colors hover:bg-muted/50">
                              <td className="px-4 py-4 font-semibold text-card-foreground whitespace-nowrap">
                                {record.worker.fullName}
                              </td>

                              <td className="px-4 py-4 whitespace-nowrap">
                                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
                                  {record.status}
                                </span>
                              </td>

                              <td className="px-4 py-4 text-muted-foreground whitespace-nowrap">
                                {record.createdAt.toDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}