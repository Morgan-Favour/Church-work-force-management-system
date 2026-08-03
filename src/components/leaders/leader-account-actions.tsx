"use client";

import { useState } from "react";
import {
  KeyRound,
  ShieldCheck,
} from "lucide-react";

import {
  deactivateLeader,
  reactivateLeader,
} from "@/actions/leader.actions";

import { ResetPasswordModal } from "./reset-password-modal";

type Props = {
  leaderId: string;
  isActive: boolean;
};

export function LeaderAccountActions({
  leaderId,
  isActive,
}: Props) {
  const [passwordModalOpen, setPasswordModalOpen] =
    useState(false);

  return (
    <>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0e2d33]/10 text-[#0e2d33]">
            <ShieldCheck size={20} />
          </div>

          <div>
            <h2 className="font-bold text-slate-900">
              Account Actions
            </h2>

            <p className="text-sm text-slate-500">
              Reset password or manage account status.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setPasswordModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0e2d33] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#123940]"
          >
            <KeyRound size={17} />
            Reset Password
          </button>

          {isActive ? (
            <form action={deactivateLeader}>
              <input
                type="hidden"
                name="leaderId"
                value={leaderId}
              />

              <button
                type="submit"
                className="rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-50"
              >
                Deactivate Leader
              </button>
            </form>
          ) : (
            <form action={reactivateLeader}>
              <input
                type="hidden"
                name="leaderId"
                value={leaderId}
              />

              <button
                type="submit"
                className="rounded-xl border border-emerald-200 px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
              >
                Reactivate Leader
              </button>
            </form>
          )}
        </div>
      </section>

      <ResetPasswordModal
        open={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        leaderId={leaderId}
      />
    </>
  );
}