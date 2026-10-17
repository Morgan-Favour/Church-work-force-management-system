type Props = {
  message?: string | null;
};

export function InviteInvalidCard({ message }: Props) {
  return (
    <div className="mx-auto mt-24 max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-lg">
      <h1 className="text-2xl font-bold tracking-tight text-card-foreground">
        Invite Invalid
      </h1>

      <p className="mt-4 text-sm text-muted-foreground">
        {message ?? "This invitation is no longer valid."}
      </p>
    </div>
  );
}