
"use client";

import { completeWorkerRegistration } from "@/actions/worker.actions";
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

export function WorkerInviteForm({ token }: Props) {
  return (
    <form
      action={completeWorkerRegistration}
      className="space-y-6"
    >
      <input
        type="hidden"
        name="token"
        value={token}
      />

      <div>
        <label className="mb-2 block text-sm font-semibold text-card-foreground">
          Full Name
        </label>
        <input
          name="fullName"
          required
          placeholder="John Doe"
          className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-card-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-card-foreground">
          Phone Number
        </label>
        <input
          name="phone"
          required
          type="tel"
          inputMode="numeric"
          placeholder="08012345678"
          className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-card-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-card-foreground">
          Gender
        </label>
        <select
          name="gender"
          required
          defaultValue=""
          className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-card-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
        >
          <option value="" disabled>
            Select Gender
          </option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      <SubmitButton />
    </form>
  );
}
