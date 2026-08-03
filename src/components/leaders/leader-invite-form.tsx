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
        className="w-full rounded-xl bg-[#0e2d33] py-3 font-semibold text-white hover:bg-[#15414a]"
      >
        Submit Registration
      </button>
    </form>
  );
}