import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  href?: string;
  helper?: string;
};

export function StatCard({
  label,
  value,
  icon: Icon,
  href,
  helper,
}: StatCardProps) {
  const content = (
    <>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 sm:text-sm">
          {label}
        </p>

        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0e2d33]/10 text-[#0e2d33] sm:h-11 sm:w-11">
            <Icon size={20} />
          </div>
        )}
      </div>

      <h2 className="mt-4 text-2xl font-bold text-slate-900 sm:text-2xl lg:text-3xl">
        {value}
      </h2>

      {helper && <p className="mt-2 text-xs text-slate-500">{helper}</p>}
    </>
  );

  const className =
    "block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:bg-slate-50 sm:p-6";

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}