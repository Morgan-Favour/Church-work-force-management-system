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
        label="Attendance History"
        title="View Attendance Records"
        description={
          isAdmin
            ? "View attendance records across all departments, grouped by date and gathering."
            : "View attendance records for your departments, grouped by date and gathering."
        }
      />

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Search Attendance</h2>

        <form
          method="GET"
          action="/attendance/history"
          className="mt-5 grid gap-4 md:grid-cols-[1fr_auto_auto]"
        >
          <input
            type="date"
            name="date"
            defaultValue={selectedDate || ""}
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#0e2d33] focus:ring-4 focus:ring-[#0e2d33]/10"
          />

          <button
            type="submit"
            className="rounded-xl bg-[#0e2d33] px-5 py-3 text-sm font-bold text-white hover:bg-[#123940]"
          >
            Search Date
          </button>

          <a
            href="/attendance/history"
            className="rounded-xl border border-slate-200 px-5 py-3 text-center text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Clear
          </a>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900">
            Attendance Records
          </h2>

          <p className="text-sm text-slate-500">
            Showing {records.length} record(s)
            {selectedDate ? ` for ${selectedDate}` : ""}.
          </p>
        </div>

        {records.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center">
            <p className="font-semibold text-slate-700">
              No attendance records found
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Try another date or mark attendance first.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedRecords).map(([date, gatherings]) => (
              <div key={date} className="space-y-4">
                <div className="rounded-2xl bg-slate-100 px-5 py-4">
                  <h3 className="text-lg font-bold text-slate-900">{date}</h3>
                </div>

                {Object.entries(gatherings).map(([key, group]) => (
                  <div
                    key={key}
                    className="overflow-hidden rounded-2xl border border-slate-200"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
                      <div>
                        <h4 className="font-bold text-slate-900">
                          {group.serviceTitle}
                        </h4>
                        <p className="text-sm text-slate-500">
                          {group.departmentName} Department
                        </p>
                      </div>

                      <span className="rounded-full bg-[#0e2d33]/10 px-3 py-1 text-xs font-bold text-[#0e2d33]">
                        {group.records.length} record(s)
                      </span>
                    </div>

                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                        <tr>
                          <th className="px-4 py-3">Worker</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Marked On</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-200 bg-white">
                        {group.records.map((record) => (
                          <tr key={record.id} className="hover:bg-slate-50">
                            <td className="px-4 py-4 font-semibold text-slate-900">
                              {record.worker.fullName}
                            </td>

                            <td className="px-4 py-4">
                              <span className="rounded-full bg-[#0e2d33]/10 px-3 py-1 text-xs font-bold text-[#0e2d33]">
                                {record.status}
                              </span>
                            </td>

                            <td className="px-4 py-4 text-slate-600">
                              {record.createdAt.toDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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