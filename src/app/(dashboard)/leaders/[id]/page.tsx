import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, KeyRound, ShieldCheck, UserRound } from "lucide-react";
import {
  deactivateLeader,
  reactivateLeader,
  resetLeaderPassword,
} from "@/actions/leader.actions";

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
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#0e2d33]"
      >
        <ArrowLeft size={17} />
        Back to Leaders
      </Link>

      <section className="rounded-3xl bg-[#0e2d33] p-6 text-white shadow-xl shadow-slate-300/40 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-[#d4af37]">
              <UserRound size={28} />
            </div>

            <div>
              <p className="text-sm font-semibold text-[#d4af37]">
                Leader Profile
              </p>
              <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                {leader.fullName}
              </h1>
              <p className="mt-1 text-sm text-white/65">@{leader.username}</p>
            </div>
          </div>

          <span
            className={
              leader.isActive
                ? "w-fit rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-200"
                : "w-fit rounded-full bg-red-400/15 px-3 py-1 text-xs font-bold text-red-200"
            }
          >
            {leader.isActive ? "Active Leader" : "Inactive Leader"}
          </span>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0e2d33]/10 text-[#0e2d33]">
              <ShieldCheck size={21} />
            </div>
            <h2 className="font-bold text-slate-900">Departments Led</h2>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {leader.leaderDepartments.length === 0 ? (
              <p className="text-sm text-slate-500">
                No leadership department assigned.
              </p>
            ) : (
              leader.leaderDepartments.map((item) => (
                <span
                  key={item.id}
                  className="rounded-full bg-[#0e2d33]/10 px-3 py-1 text-xs font-semibold text-[#0e2d33]"
                >
                  Leads {item.department.name}
                </span>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-bold text-slate-900">Linked Worker Profile</h2>

          <p className="mt-3 text-sm text-slate-500">
            {leader.worker?.phone || "No phone number"}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {leader.worker?.departments.map((item) => (
              <span
                key={item.id}
                className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
              >
                Works in {item.department.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0e2d33]/10 text-[#0e2d33]">
            <KeyRound size={21} />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">Account Actions</h2>
            <p className="text-sm text-slate-500">
              Reset password or change account status.
            </p>
          </div>
        </div>

        <form
          action={resetLeaderPassword}
          className="mt-6 grid gap-3 md:grid-cols-[1fr_1fr_auto]"
        >
          <input type="hidden" name="leaderId" defaultValue={leader.id} />

          <input
            name="password"
            type="password"
            required
            minLength={8}
            placeholder="New password"
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#0e2d33] focus:ring-4 focus:ring-[#0e2d33]/10"
          />

          <input
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            placeholder="Confirm password"
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#0e2d33] focus:ring-4 focus:ring-[#0e2d33]/10"
          />

          <button
            type="submit"
            className="rounded-xl bg-[#0e2d33] px-5 py-3 text-sm font-bold text-white hover:bg-[#123940]"
          >
            Reset Password
          </button>
        </form>

        <div className="mt-6 border-t border-slate-200 pt-5">
          {leader.isActive ? (
            <form action={deactivateLeader}>
              <input type="hidden" name="leaderId" defaultValue={leader.id} />
              <button
                type="submit"
                className="rounded-xl border border-red-200 px-4 py-3 text-sm font-bold text-red-700 hover:bg-red-50"
              >
                Deactivate Leader
              </button>
            </form>
          ) : (
            <form action={reactivateLeader}>
              <input type="hidden" name="leaderId" defaultValue={leader.id} />
              <button
                type="submit"
                className="rounded-xl border border-emerald-200 px-4 py-3 text-sm font-bold text-emerald-700 hover:bg-emerald-50"
              >
                Reactivate Leader
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}