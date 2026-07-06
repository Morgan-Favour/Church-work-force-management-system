import Link from "next/link";

type Leader = {
  id: string;
  fullName: string;
  username: string;
  workerId: string | null;
  isActive: boolean;
  leaderDepartments: {
    id: string;
    department: {
      name: string;
    };
  }[];
};

export function LeaderList({ leaders }: { leaders: Leader[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-base font-bold text-slate-900 sm:text-lg">
        Leader List
      </h2>

      <p className="mb-6 text-sm text-slate-500">
        {leaders.length} leader account(s)
      </p>

      {leaders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center">
          <p className="font-semibold text-slate-700">No leaders yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leaders.map((leader) => (
            <Link
              href={`/leaders/${leader.id}`}
              key={leader.id}
              className="block rounded-2xl border border-slate-200 p-4 transition hover:bg-slate-50"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-slate-900">
                    {leader.fullName}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    @{leader.username}
                  </p>
                </div>

                <span
                  className={
                    leader.isActive
                      ? "rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
                      : "rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700"
                  }
                >
                  {leader.isActive ? "Active" : "Inactive"}
                </span>
              </div>


              <div className="mt-3 flex flex-wrap gap-2">
                {leader.leaderDepartments.map((item) => (
                  <span
                    key={item.id}
                    className="rounded-full bg-[#0e2d33]/10 px-3 py-1 text-xs font-semibold text-[#0e2d33]"
                  >
                    Leads {item.department.name}
                  </span>
                ))}

                {leader.workerId && (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Worker Profile
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}