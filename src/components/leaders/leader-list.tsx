
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AssignLeaderDepartmentModal } from "./assign-leader-department-modal";

const PAGE_SIZE = 10;

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

type Department = {
  id: string;
  name: string;
};

type LeaderListProps = {
  leaders: Leader[];
  departments: Department[];
  occupiedDepartmentIds: string[];
};

export function LeaderList({
  leaders,
  departments,
  occupiedDepartmentIds,
}: LeaderListProps) {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);

  // Get all unique departments assigned to leaders
  const departmentNames = useMemo(() => {
    const names = leaders.flatMap((leader) =>
      leader.leaderDepartments.map((item) => item.department.name)
    );

    return Array.from(new Set(names)).sort();
  }, [leaders]);

  // Search and filter leaders
  const filteredLeaders = useMemo(() => {
    const value = search.trim().toLowerCase();

    return leaders.filter((leader) => {
      const leaderDepartmentNames = leader.leaderDepartments.map(
        (item) => item.department.name
      );

      const matchesSearch =
        !value ||
        leader.fullName.toLowerCase().includes(value) ||
        leader.username.toLowerCase().includes(value) ||
        leaderDepartmentNames.join(" ").toLowerCase().includes(value);

      const matchesDepartment =
        department === "all" ||
        leaderDepartmentNames.includes(department);

      const matchesStatus =
        status === "all" ||
        (status === "active" && leader.isActive) ||
        (status === "inactive" && !leader.isActive);

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [leaders, search, department, status]);

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredLeaders.length / PAGE_SIZE)
  );

  const visibleLeaders = filteredLeaders.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  function resetPage() {
    setPage(1);
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-6">
        <h2 className="text-base font-bold text-card-foreground sm:text-lg">
          Leader List
        </h2>

        <p className="text-sm text-muted-foreground">
          Showing {visibleLeaders.length} of {filteredLeaders.length} leader(s)
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 grid gap-3 lg:grid-cols-[1fr_220px_180px]">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            resetPage();
          }}
          placeholder="Search by name, username, or department..."
          className="rounded-xl border border-input bg-card px-4 py-3 text-sm text-card-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
        />

        <select
          value={department}
          onChange={(e) => {
            setDepartment(e.target.value);
            resetPage();
          }}
          className="rounded-xl border border-input bg-card px-4 py-3 text-sm text-card-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
        >
          <option value="all">All departments</option>

          {departmentNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            resetPage();
          }}
          className="rounded-xl border border-input bg-card px-4 py-3 text-sm text-card-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
        >
          <option value="all">All status</option>
          <option value="active">Active only</option>
          <option value="inactive">Inactive only</option>
        </select>
      </div>

      {leaders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center">
          <p className="font-semibold text-card-foreground">
            No leaders yet
          </p>
        </div>
      ) : visibleLeaders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center">
          <p className="font-semibold text-card-foreground">
            No matching leaders
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <>
          {/* Leader Cards */}
          <div className="space-y-3">
            {visibleLeaders.map((leader) => (
              <div
                key={leader.id}
                className="rounded-2xl border border-border bg-card p-4 shadow-sm transition hover:bg-muted/50"
              >
                <Link
                  href={`/leaders/${leader.id}`}
                  className="block"
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

                {/* Assign another department */}
                <div className="mt-4 border-t border-border pt-3">
                  <button
                    type="button"
                    disabled={!leader.isActive}
                    onClick={() => setSelectedLeader(leader)}
                    className="rounded-xl bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Assign Department
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() =>
                setPage((current) => Math.max(1, current - 1))
              }
              className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-bold text-card-foreground transition hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </p>

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
              className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-bold text-card-foreground transition hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Assign Department Modal */}
      {selectedLeader && (
        <AssignLeaderDepartmentModal
          open={true}
          onClose={() => setSelectedLeader(null)}
          leaderId={selectedLeader.id}
          leaderName={selectedLeader.fullName}
          departments={departments}
          occupiedDepartmentIds={occupiedDepartmentIds}
        />
      )}
    </div>
  );
}
