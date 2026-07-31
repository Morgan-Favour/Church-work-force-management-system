import { notFound } from "next/navigation";
import { InviteRegistrationLayout } from "@/components/layout/InviteRegistrationLayout";
import { InviteInvalidCard } from "@/components/invites/InviteInvalidCard";
import { LeaderRegistrationFields } from "@/components/invites/LeaderRegistrationFields";
import { validateInvite } from "@/lib/invite";
import { completeLeaderRegistration } from "@/actions/leader.actions";

type Props = {
  params: Promise<{
    token: string;
  }>;
};

export default async function LeaderInvitePage({
  params,
}: Props) {
  const { token } = await params;

  const result = await validateInvite(token);

  if (!result.valid) {
    return <InviteInvalidCard message={result.message} />;
  }

  if (!result.invite?.pendingLeader) {
    notFound();
  }

  return (
    <InviteRegistrationLayout
      title="Leader Registration"
      description="Complete your registration to join the church workforce."
    >
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
    </InviteRegistrationLayout>
  );
}