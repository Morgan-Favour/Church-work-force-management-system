import Link from "next/link";
import { SectionCard } from "@/components/ui/section-card";

type QuickAction = {
  label: string;
  href: string;
  primary?: boolean;
};

export function QuickActionsCard({
  actions,
}: {
  actions: QuickAction[];
}) {
  return (
    <SectionCard title="Quick Actions">
      <div className="space-y-3">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={
              action.primary
                ? "block rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                : "block rounded-xl border border-border bg-card px-4 py-3 text-center text-sm font-semibold text-card-foreground transition hover:bg-muted/50"
            }
          >
            {action.label}
          </Link>
        ))}
      </div>
    </SectionCard>
  );
}