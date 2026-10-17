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
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <h2 className="text-base font-bold text-card-foreground sm:text-lg">
        Leader List
      </h2>

      <p className="mb-6 text-sm text-muted-foreground">
        {leaders.length} leader account(s)
      </p>

      {leaders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center">
          <p className="font-semibold text-card-foreground">No leaders yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leaders.map((leader) => (
            <Link
              href={`/leaders/${leader.id}`}
              key={leader.id}
              className="block rounded-2xl border border-border bg-card p-4 shadow-sm transition hover:bg-muted/50"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-card-foreground">
                    {leader.fullName}
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    @{leader.username}
                  </p>
                </div>

                <span
                  className={
                    leader.isActive
                      ? "rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
                      : "rounded-full bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive"
                  }
                >
                  {leader.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {leader.leaderDepartments.map((item) => (
                  <span
                    key={item.id}
                    className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                  >
                    Leads {item.department.name}
                  </span>
                ))}

                {leader.workerId && (
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
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