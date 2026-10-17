"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  UserCog,
  ClipboardCheck,
  BarChart3,
  Settings,
  type LucideIcon,
  CheckCircle2,
} from "lucide-react";

type IconName =
  | "dashboard"
  | "departments"
  | "workers"
  | "leaders"
  | "attendance"
  | "activity"
  | "reports"
  | "settings"
  | "members"
  | "approvals";   
  

const icons: Record<IconName, LucideIcon> = {
  dashboard: LayoutDashboard,
  departments: Building2,
  workers: Users,
  leaders: UserCog,
  attendance: ClipboardCheck,
  activity: BarChart3,
  reports: BarChart3,
  settings: Settings,
  approvals: CheckCircle2,
  members: Users
};

type DashboardNavLinkProps = {
  href: string;
  label: string;
  icon: IconName;
  mobile?: boolean;
};

export function DashboardNavLink({
  href,
  label,
  icon,
  mobile = false,
}: DashboardNavLinkProps) {
  const pathname = usePathname();

  const Icon = icons[icon];

  const isActive =
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  if (mobile) {
    return (
      <Link
  href={href}
  className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition ${
    isActive
      ? "border-card bg-card text-card-foreground shadow-sm"
      : "border-border bg-primary text-primary-foreground hover:opacity-90"
  }`}
>
  <Icon size={15} />
  {label}<Link
  href={href}
  className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition ${
    isActive
      ? "border-card bg-card text-card-foreground shadow-sm"
      : "border-border bg-primary text-primary-foreground hover:opacity-90"
  }`}
>
  <Icon size={15} />
  {label}
</Link>
</Link>
    );
  }

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
        isActive
          ? "bg-white/15 text-white"
          : "text-white/75 hover:bg-white/10 hover:text-white"
      }`}
    >
      <Icon size={19} />
      {label}
    </Link>
  );
}