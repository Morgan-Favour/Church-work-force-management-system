import { PasswordInput } from "@/components/ui/password-ui";

export function LeaderRegistrationFields() {
  return (
    <>
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
    </>
  );
}