import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { Building2 } from "lucide-react";

export default async function DepartmentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const department = await prisma.department.findUnique({
    where: {
      id,
    },
    include: {
      workers: {
        include: {
          worker: {
            include: {
              attendance: true,
            },
          },
        },
      },
    },
  });

  if (!department) {
    notFound();
  }

  const workerCount = department.workers.length;

  let totalRecords = 0;
  let presentRecords = 0;

  department.workers.forEach((item) => {
    item.worker.attendance.forEach((attendance) => {
      totalRecords++;

      if (
        attendance.status === "PRESENT" ||
        attendance.status === "LATE"
      ) {
        presentRecords++;
      }
    });
  });

  const attendanceRate =
    totalRecords > 0
      ? Math.round((presentRecords / totalRecords) * 100)
      : 0;

  return (
    <div className="space-y-8">
      {/* Hero Header Card */}
      <section className="rounded-3xl bg-primary p-8 text-primary-foreground shadow-xl">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/10">
            <Building2 size={30} />
          </div>

          <div>
            <p className="text-sm font-medium opacity-80">Department Profile</p>

            <h1 className="text-3xl font-bold">
              {department.name}
            </h1>

            <p className="mt-2 text-primary-foreground/80">
              {department.description || "No description"}
            </p>
          </div>
        </div>
      </section>

      {/* Metrics Stats Grid */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">
            Total Workers
          </p>

          <h2 className="mt-4 text-4xl font-bold text-card-foreground">
            {workerCount}
          </h2>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">
            Attendance Records
          </p>

          <h2 className="mt-4 text-4xl font-bold text-card-foreground">
            {totalRecords}
          </h2>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">
            Attendance Rate
          </p>

          <h2 className="mt-4 text-4xl font-bold text-card-foreground">
            {attendanceRate}%
          </h2>
        </div>
      </section>

      {/* Workers List Card */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-bold text-card-foreground">
          Department Workers
        </h2>

        <div className="mt-6 space-y-3">
          {department.workers.map((item) => (
            <a
              key={item.worker.id}
              href={`/workers/${item.worker.id}`}
              className="flex items-center justify-between rounded-xl border border-border bg-background p-4 transition-colors hover:bg-muted/50"
            >
              <div>
                <h3 className="font-semibold text-card-foreground">
                  {item.worker.fullName}
                </h3>

                <p className="text-sm text-muted-foreground">
                  {item.worker.phone || "No phone"}
                </p>
              </div>

              <span className="text-sm font-semibold text-primary hover:underline">
                View Profile →
              </span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}