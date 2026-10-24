
"use client";

import { completeLeaderRegistration } from "@/actions/leader.actions";
import { LeaderRegistrationFields } from "@/components/invites/LeaderRegistrationFields";
import { useFormStatus } from "react-dom";

type Props = {
  token: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Submitting..." : "Submit Registration"}
    </button>
  );
}

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

      <SubmitButton />
    </form>
  );
}
