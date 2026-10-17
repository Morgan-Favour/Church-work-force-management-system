"use client";

import { completeLeaderRegistration } from "@/actions/leader.actions";
import { LeaderRegistrationFields } from "@/components/invites/LeaderRegistrationFields";

type Props = {
  token: string;
};

export function LeaderInviteForm({ token }: Props) {
  return (
    <form
      action={completeLeaderRegistration}
      className="space-y-6"
    >
      <input
        type="hidden"
        name="token"
        value={token}
      />

      <LeaderRegistrationFields />

      <button
        type="submit"
        className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-sm transition hover:opacity-90"
      >
        Submit Registration
      </button>
    </form>
  );
}