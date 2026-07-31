import {
  ApprovalCardData,
  PendingApprovalCard,
} from "./pending-approval-card";

type Props = {
  title: string;
  type: "leader" | "worker";
  approvals: ApprovalCardData[];
};

export function PendingApprovalSection({
  title,
  type,
  approvals,
}: Props) {
  return (
    <section className="rounded-2xl border bg-white p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold">
          {title}
        </h2>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
          {approvals.length}
        </span>
      </div>

      {approvals.length === 0 ? (
        <p className="text-slate-500">
          No pending {type}s.
        </p>
      ) : (
        <div className="space-y-4">
          {approvals.map((approval) => (
            <PendingApprovalCard
              key={approval.id}
              type={type}
              approval={approval}
            />
          ))}
        </div>
      )}
    </section>
  );
}