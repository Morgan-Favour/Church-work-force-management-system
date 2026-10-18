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
  | "g12"
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
  members: Users,
  g12: Users,
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
        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
          isActive
            ? "bg-muted font-semibold text-card-foreground"
            : "text-card-foreground/80 hover:bg-muted/50 hover:text-card-foreground"
        }`}
      >
        <Icon size={18} className={isActive ? "text-primary" : "text-muted-foreground"} />
        {label}
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