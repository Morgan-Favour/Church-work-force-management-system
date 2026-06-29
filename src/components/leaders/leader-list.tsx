type Department = {
  id: string;
  name: string;
};

type Leader = {
  id: string;
  fullName: string;
  username: string;
  departmentId: string | null;
  workerId: string | null;
};

type LeaderListProps = {
  leaders: Leader[];
  departments: Department[];
};

export function LeaderList({ leaders, departments }: LeaderListProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6">
        <h2 className="text-base font-bold text-slate-900 sm:text-lg">
          Leader List
        </h2>
        <p className="text-sm text-slate-500">
          {leaders.length} leader(s) created
        </p>
      </div>

      {leaders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center sm:p-10">
          <p className="font-semibold text-slate-700">No leaders yet</p>
          <p className="mt-1 text-sm text-slate-500">
            Create a leader after creating departments.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {leaders.map((leader) => {
            const department = departments.find(
              (item) => item.id === leader.departmentId
            );

            return (
              <div
                key={leader.id}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="font-bold text-slate-900">
                    {leader.fullName}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    @{leader.username}
                  </p>

                  <p className="mt-1 text-xs font-medium text-[#0e2d33]">
                    {department?.name || "No department assigned"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="w-fit rounded-full bg-[#0e2d33]/10 px-3 py-1 text-xs font-semibold text-[#0e2d33]">
                    Leader
                  </span>

                  {leader.workerId && (
                    <span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      Worker Profile
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}