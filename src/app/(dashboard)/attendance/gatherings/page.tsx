
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";

import { PageHeader } from "@/components/ui/page-header";
import { GatheringManagement } from "@/components/attendance/gathering-management";

export default async function GatheringManagementPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const [session, params] = await Promise.all([
    getServerSession(authOptions),
    searchParams,
  ]);

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== UserRole.ADMIN) {
    redirect("/attendance");
  }

  const gatherings = await prisma.service.findMany({
    orderBy: [{ date: "desc" }, { title: "asc" }],
    select: {
      id: true,
      title: true,
      date: true,
      isActive: true,
      archivedAt: true,
    },
  });

  const feedback: Record<string, { title: string; text: string }> = {
    "gathering-activated": {
      title: "Gathering activated",
      text: "Attendance can now be recorded for this gathering.",
    },
    "gathering-deactivated": {
      title: "Gathering deactivated",
      text: "This gathering is now closed for attendance marking.",
    },
    "gathering-invalid": {
      title: "Invalid request",
      text: "Please try the action again.",
    },
    "gathering-not-found": {
      title: "Gathering not found",
      text: "This gathering may have been removed or no longer exists.",
    },
    unauthorized: {
      title: "Access denied",
      text: "Only an administrator can manage gatherings.",
    },
    "connection-error": {
      title: "Something went wrong",
      text: "The gathering could not be updated. Please try again.",
    },
  };

  const notice = params.message ? feedback[params.message] : undefined;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gathering Management"
        description="Activate gatherings when attendance should be recorded and deactivate them when the meeting is over."
        action={
          <Link
            href="/attendance"
            className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-card-foreground shadow-sm transition hover:bg-muted"
          >
            Back to Attendance
          </Link>
        }
      />

      {notice && (
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="font-bold text-card-foreground">{notice.title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{notice.text}</p>
        </div>
      )}

      <GatheringManagement
        gatherings={gatherings.map((gathering) => ({
          id: gathering.id,
          title: gathering.title,
          date: gathering.date,
          isActive:
            gathering.isActive && gathering.archivedAt === null,
          archivedAt: gathering.archivedAt,
        }))}
      />
    </div>
  );
}
