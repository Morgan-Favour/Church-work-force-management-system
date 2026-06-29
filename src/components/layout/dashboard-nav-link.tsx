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
} from "lucide-react";

type IconName =
  | "dashboard"
  | "departments"
  | "workers"
  | "leaders"
  | "attendance"
  | "activity"
  | "reports"
  | "settings";

const icons: Record<IconName, LucideIcon> = {
  dashboard: LayoutDashboard,
  departments: Building2,
  workers: Users,
  leaders: UserCog,
  attendance: ClipboardCheck,
  activity: BarChart3,
  reports: BarChart3,
  settings: Settings,
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
            ? "border-white bg-white text-[#0e2d33]"
            : "border-slate-200 bg-[#0e2d33] text-white hover:bg-slate-50"
        }`}
      >
        <Icon size={15} />
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