"use client";

type Department = {
  department: {
    name: string;
  };
};

type PendingApprovalCardProps = {
  id: string;
  name: string;
  subtitle?: string;
  phone?: string | null;
  departments: Department[];

  approveAction: (formData: FormData) => void | Promise<void>;
  rejectAction: (formData: FormData) => void | Promise<void>;

  hiddenField: string;
};

export function PendingApprovalCard({
  id,
  name,
  subtitle,
  phone,
  departments,
  approveAction,
  rejectAction,
  hiddenField,
}: PendingApprovalCardProps) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">
          {name}
        </h3>

        {subtitle && (
          <p className="text-sm text-gray-500">
            {subtitle}
          </p>
        )}

        {phone && (
          <p className="text-sm">
            {phone}
          </p>
        )}

        <div className="flex flex-wrap gap-2 pt-2">
          {departments.map((dept) => (
            <span
              key={dept.department.name}
              className="rounded-full bg-[#0e2d33]/10 px-3 py-1 text-sm text-[#0e2d33]"
            >
              {dept.department.name}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <form action={approveAction}>
          <input
            type="hidden"
            name={hiddenField}
            value={id}
          />

          <button
            type="submit"
            className="rounded-lg bg-green-600 px-5 py-2 font-semibold text-white hover:bg-green-700"
          >
            Approve
          </button>
        </form>

        <form action={rejectAction}>
          <input
            type="hidden"
            name={hiddenField}
            value={id}
          />

          <button
            type="submit"
            className="rounded-lg bg-red-600 px-5 py-2 font-semibold text-white hover:bg-red-700"
          >
            Reject
          </button>
        </form>
      </div>
    </div>
  );
}