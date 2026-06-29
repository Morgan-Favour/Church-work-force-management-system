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
                ? "block rounded-xl bg-[#0e2d33] px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#123940]"
                : "block rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            }
          >
            {action.label}
          </Link>
        ))}
      </div>
    </SectionCard>
  );
}