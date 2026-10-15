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
      {/* {activities.length === 0 ? (
        <p className="text-sm text-muted-foreground">No activity yet.</p>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="border-b border-border pb-3 last:border-0"
            >
              <p className="text-sm font-medium text-card-foreground">
                {activity.description}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {activity.createdAt.toLocaleString()}
              </p>
            </div>
          ))}

          <Link
            href="/activity"
            className="inline-flex text-sm font-bold text-primary hover:underline"
          >
            View all activity
          </Link>
        </div>
      )} */}

      <p className="text-xs font-medium text-muted-foreground">
        We are currently working on this feature. It will be available in the next update.
      </p>
    </SectionCard>
  );
}