"use client";

import { completeWorkerRegistration } from "@/actions/worker.actions";

type Props = {
  token: string;
};

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
          Phone Number
        </label>

        <input
          name="phone"
          required
          placeholder="08012345678"
          className="w-full rounded-xl border p-3"
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">
          Gender
        </label>

        <select
          name="gender"
          required
          className="w-full rounded-xl border p-3"
        >
          <option value="">
            Select Gender
          </option>

          <option value="Male">
            Male
          </option>

          <option value="Female">
            Female
          </option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-[#0e2d33] py-3 font-semibold text-white hover:bg-[#15414a]"
      >
        Submit Registration
      </button>
    </form>
  );
}