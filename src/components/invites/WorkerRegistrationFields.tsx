export function WorkerRegistrationFields() {
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
          defaultValue=""
        >
          <option value="" disabled>
            Select gender
          </option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>
    </>
  );
}