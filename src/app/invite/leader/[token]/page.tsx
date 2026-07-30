import { PasswordInput } from "@/components/ui/password-ui";
import { validateInvite } from "@/lib/invite";
import { completeLeaderRegistration } from "@/actions/leader.actions";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    token: string;
  }>;
};

export default async function LeaderInvitePage({ params }: Props) {
  const { token } = await params;

  const result = await validateInvite(token);

  if (!result.valid) {
    return (
      <div className="mx-auto mt-24 max-w-lg rounded-xl border bg-white p-8 text-center shadow">
        <h1 className="text-2xl font-bold">
          Invite Invalid
        </h1>

        <p className="mt-4 text-gray-600">
          {result.message}
        </p>
      </div>
    );
  }

  if (!result.invite?.pendingLeader) {
    notFound();
  }

  return (
    <div className="mx-auto mt-16 max-w-xl rounded-2xl border bg-white p-8 shadow-lg">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0e2d33]">
          Leader Registration
        </h1>

        <p className="mt-2 text-gray-500">
          Complete your registration to join the church workforce.
        </p>
      </div>

      <form
        action={completeLeaderRegistration}
        className="space-y-6"
      >
        <input
          type="hidden"
          name="token"
          value={token}
        />

        <div>
          <label className="mb-2 block font-medium">
            Full Name
          </label>

          <input
            name="fullName"
            required
            placeholder="John Doe"
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Username
          </label>

          <input
            name="username"
            required
            placeholder="john"
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Phone Number
          </label>

          <input
            name="phone"
            required
            placeholder="08012345678"
            className="w-full rounded-xl border p-3"
          />
        </div>

        <PasswordInput
          name="password"
          label="Password"
          required
          minLength={8}
          placeholder="Minimum 8 characters"
          autoComplete="new-password"
        />

        <button
          type="submit"
          className="w-full rounded-xl bg-[#0e2d33] py-3 font-semibold text-white transition hover:bg-[#15414a]"
        >
          Submit Registration
        </button>

      </form>

    </div>
  );
}