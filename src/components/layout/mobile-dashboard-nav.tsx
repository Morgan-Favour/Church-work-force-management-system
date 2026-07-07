"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { DashboardNavLink } from "@/components/layout/dashboard-nav-link";

type NavItem = {
  label: string;
  href: string;
  icon:
    | "dashboard"
    | "departments"
    | "workers"
    | "leaders"
    | "attendance"
    | "activity"
    | "reports"
    | "settings";
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
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0e2d33] px-4 py-4 lg:hidden">
      <div className="flex items-center justify-between">
        <Link href="/dashboard" className="flex min-w-0 items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
            <Image src="/logo.png" alt="Logo" width={40} height={40} />
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-sm font-bold text-white">
              GIC Egbelu
            </h1>
            <p className="truncate text-xs text-white/70">
              Workforce System
            </p>
          </div>
        </Link>

        {!disabled && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-xl border border-white/20 p-2 text-white"
          >
            <Menu size={22} />
          </button>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50">
          <div className="ml-auto flex h-full w-[82%] max-w-sm flex-col bg-[#0e2d33] p-5 text-white shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-bold">Menu</h2>
                <p className="text-xs text-white/60">{roleLabel}</p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-white/20 p-2 text-white"
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

            <div className="mt-auto border-t border-white/10 pt-4">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="truncate text-sm font-semibold text-white">
                  {userName}
                </p>
                <p className="mt-1 truncate text-xs text-white/60">
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