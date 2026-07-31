export default function LeaderRegistrationSuccessPage() {
  return (
    <div className="mx-auto mt-24 max-w-xl rounded-2xl border bg-white p-10 shadow">

      <div className="text-center">

        <div className="mb-6 text-6xl">
          ✅
        </div>

        <h1 className="text-3xl font-bold text-[#0e2d33]">
          Registration Submitted
        </h1>

        <p className="mt-5 text-gray-600">
          Your registration has been submitted successfully.
        </p>

        <p className="mt-3 text-gray-600">
          An administrator or your department leader will review your request before your account becomes active.
        </p>

      </div>

    </div>
  );
}