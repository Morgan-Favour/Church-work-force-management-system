type Props = {
  message?: string | null;
};

export function InviteInvalidCard({ message }: Props) {
  return (
    <div className="mx-auto mt-24 max-w-lg rounded-xl border bg-white p-8 text-center shadow">
      <h1 className="text-2xl font-bold">
        Invite Invalid
      </h1>

      <p className="mt-4 text-gray-600">
        {message ?? "This invitation is no longer valid."}
      </p>
    </div>
  );
}