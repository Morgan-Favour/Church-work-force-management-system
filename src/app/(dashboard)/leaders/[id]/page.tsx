import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, UserRound } from "lucide-react";

import { LeaderAccountActions } from "@/components/leaders/leader-account-actions";


export default async function LeaderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;


  const leader = await prisma.user.findUnique({
    where: { id },
    include: {
      leaderDepartments: {
        include: { department: true },
      },
      worker: {
        include: {
          departments: {
            include: { department: true },
          },
        },
      },
    },
  });

  if (!leader) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/leaders"
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft size={17} />
        Back to Leaders
      </Link>

      <section className="rounded-3xl bg-primary p-6 text-primary-foreground shadow-xl sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-foreground/10 text-secondary">
              <UserRound size={28} />
            </div>

            <div>
              <p className="text-sm font-semibold text-secondary">
                Leader Profile
              </p>
              <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                {leader.fullName}
              </h1>
              <p className="mt-1 text-sm text-primary-foreground/70">@{leader.username}</p>
            </div>
          </div>

          <span
            className={
              leader.isActive
                ? "w-fit rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300"
                : "w-fit rounded-full bg-destructive/20 px-3 py-1 text-xs font-bold text-destructive-foreground"
            }
          >
            {leader.isActive ? "Active Leader" : "Inactive Leader"}
          </span>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
              <ShieldCheck size={21} />
            </div>
            <h2 className="font-bold text-card-foreground">Departments Led</h2>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {leader.leaderDepartments.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No leadership department assigned.
              </p>
            ) : (
              leader.leaderDepartments.map((item) => (
                <span
                  key={item.id}
                  className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground"
                >
                  Leads {item.department.name}
                </span>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="font-bold text-card-foreground">Linked Worker Profile</h2>

          <p className="mt-3 text-sm text-muted-foreground">
            {leader.worker?.phone || "No phone number"}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {leader.worker?.departments.map((item) => (
              <span
                key={item.id}
                className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground"
              >
                Works in {item.department.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <LeaderAccountActions
        leaderId={leader.id}
        isActive={leader.isActive}
      />
    </div>
  );
}