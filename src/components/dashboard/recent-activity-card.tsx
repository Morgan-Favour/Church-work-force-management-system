import Link from "next/link";
import { SectionCard } from "@/components/ui/section-card";

type Activity = {
  id: string;
  description: string;
  createdAt: Date;
};

export function RecentActivityCard({
  activities,
}: {
  activities: Activity[];
}) {
  return (
    <SectionCard
      title="Recent Activity"
      description="Latest important actions in the workforce system."
      className="lg:col-span-2"
    >
      {activities.length === 0 ? (
        <p className="text-sm text-slate-500">No activity yet.</p>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="border-b border-slate-100 pb-3 last:border-0"
            >
              <p className="text-sm font-medium text-slate-900">
                {activity.description}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {activity.createdAt.toLocaleString()}
              </p>
            </div>
          ))}

          <Link
            href="/activity"
            className="inline-flex text-sm font-bold text-[#0e2d33] hover:underline"
          >
            View all activity
          </Link>
        </div>
      )}
    </SectionCard>
  );
}