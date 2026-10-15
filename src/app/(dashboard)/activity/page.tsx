import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";

const PAGE_SIZE = 10;

export default async function ActivityPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
  }>;
}) {
  const params = await searchParams;

  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const currentPage = Number(params.page || "1");
  const page = Number.isNaN(currentPage) || currentPage < 1 ? 1 : currentPage;

  const [activities, totalActivities] = await Promise.all([
    prisma.activityLog.findMany({
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),

    prisma.activityLog.count(),
  ]);

  const totalPages = Math.ceil(totalActivities / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Activity Log"
        description="View important actions performed across the workforce system."
      />

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        {activities.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center">
            <p className="font-semibold text-card-foreground">No activity yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Activities will appear here as the system is used.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="rounded-2xl border border-border p-4 bg-background/50"
              >
                <p className="text-sm font-semibold text-card-foreground">
                  {activity.description}
                </p>

                <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span>{activity.action}</span>
                  <span>•</span>
                  <span>{activity.createdAt.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-5">
            <a
              href={`/activity?page=${page - 1}`}
              className={`rounded-xl border border-border px-4 py-2 text-sm font-bold text-card-foreground ${
                page <= 1 ? "pointer-events-none opacity-40" : "hover:bg-muted"
              }`}
            >
              Previous
            </a>

            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </p>

            <a
              href={`/activity?page=${page + 1}`}
              className={`rounded-xl border border-border px-4 py-2 text-sm font-bold text-card-foreground ${
                page >= totalPages
                  ? "pointer-events-none opacity-40"
                  : "hover:bg-muted"
              }`}
            >
              Next
            </a>
          </div>
        )}
      </section>
    </div>
  );
}