import { notFound } from "next/navigation";
import { validateInvite } from "@/lib/invite";
import { InviteRegistrationLayout } from "@/components/layout/InviteRegistrationLayout";
import { LeaderInviteForm } from "@/components/leaders/leader-invite-form"; 
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
    return (
      <InviteRegistrationLayout
        title="Invite Invalid"
        description={result.message ?? "This invite is no longer valid."}
      >
        <></>
      </InviteRegistrationLayout>
    );
  }

  if (!result.invite?.pendingLeader) {
    notFound();
  }

  return (
    <InviteRegistrationLayout
      title="Leader Registration"
      description="Complete your registration to join the church leadership."
    >
      <LeaderInviteForm token={token} />
    </InviteRegistrationLayout>
  );
}