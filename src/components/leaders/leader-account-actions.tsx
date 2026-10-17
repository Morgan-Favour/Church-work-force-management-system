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
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ShieldCheck size={20} />
          </div>

          <div>
            <h2 className="font-bold text-card-foreground">
              Account Actions
            </h2>

            <p className="text-sm text-muted-foreground">
              Reset password or manage account status.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setPasswordModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-sm transition hover:opacity-90"
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
                className="rounded-xl border border-destructive/30 bg-card px-5 py-3 text-sm font-bold text-destructive transition hover:bg-destructive/10"
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
                className="rounded-xl border border-emerald-500/30 bg-card px-5 py-3 text-sm font-bold text-emerald-600 dark:text-emerald-400 transition hover:bg-emerald-500/10"
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