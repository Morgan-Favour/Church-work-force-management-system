import { notFound } from "next/navigation";
import { validateInvite } from "@/lib/invite";
import { InviteRegistrationLayout } from "@/components/layout/InviteRegistrationLayout";
import { WorkerInviteForm } from "@/components/workers/worker-invite-form";

type Props = {
  params: Promise<{
    token: string;
  }>;
};

export default async function WorkerInvitePage({
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

  if (!result.invite?.pendingWorker) {
    notFound();
  }

  return (
    <InviteRegistrationLayout
      title="Worker Registration"
      description="Complete your registration to join the church workforce."
    >
      <WorkerInviteForm token={token} />
    </InviteRegistrationLayout>
  );
}