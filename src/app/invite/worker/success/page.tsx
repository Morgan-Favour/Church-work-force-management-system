export default function LeaderRegistrationSuccessPage() {
  return (
    <div className="mx-auto mt-24 max-w-xl rounded-2xl border border-border bg-card p-10 shadow-sm">
      <div className="text-center">
        <div className="mb-6 text-6xl">
          ✅
        </div>

        <h1 className="text-3xl font-bold text-primary">
          Registration Submitted
        </h1>

        <p className="mt-5 text-muted-foreground">
          Your registration has been submitted successfully.
        </p>

        <p className="mt-3 text-muted-foreground">
          An administrator or your department leader will review your request before your account becomes active.
        </p>
      </div>
    </div>
  );
}