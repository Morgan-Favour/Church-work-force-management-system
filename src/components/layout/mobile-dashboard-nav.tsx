"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { DashboardNavLink } from "@/components/layout/dashboard-nav-link";

// wherever NavItem is defined
export type NavItem = {
  label: string;
  href: string;
  icon:
  | "departments"
  | "attendance"
  | "workers"
  | "leaders"
  | "dashboard"
  | "activity"
  | "reports"
  | "settings"
  | "members"
  | "approvals";

};

type Props = {
  navItems: NavItem[];
  userName?: string | null;
  roleLabel: string;
  disabled?: boolean;
};

export function MobileDashboardNav({
  navItems,
  userName,
  roleLabel,
  disabled = false,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card px-4 py-4 lg:hidden">
      <div className="flex items-center justify-between">
        <Link href="/dashboard" className="flex min-w-0 items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary">
            <Image
              src="/logo.png"
              alt="GIC Egbelu Workforce"
              width={40}
              height={40}
              loading="eager"
              priority
            />
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-sm font-bold text-card-foreground">
              GIC Egbelu
            </h1>
            <p className="truncate text-xs text-muted-foreground">
              Workforce System
            </p>
          </div>
        </Link>

        {!disabled && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-xl border border-border bg-card p-2 text-card-foreground transition hover:bg-muted/50"
          >
            <Menu size={22} />
          </button>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm">
          <div className="ml-auto flex h-full w-[82%] max-w-sm flex-col border-l border-border bg-card p-5 text-card-foreground shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-card-foreground">Menu</h2>
                <p className="text-xs text-muted-foreground">{roleLabel}</p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-border bg-card p-2 text-card-foreground transition hover:bg-muted/50"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => (
                <div key={item.href} onClick={() => setOpen(false)}>
                  <DashboardNavLink
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                  />
                </div>
              ))}
            </nav>

            <div className="mt-auto border-t border-border pt-4">
              <div className="rounded-2xl border border-border bg-muted/50 p-4">
                <p className="truncate text-sm font-semibold text-card-foreground">
                  {userName}
                </p>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {roleLabel}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
