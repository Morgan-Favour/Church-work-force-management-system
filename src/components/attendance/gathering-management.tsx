
"use client";

import { useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { toggleGatheringStatus } from "@/actions/attendance.actions";

type Gathering = {
  id: string;
  title: string;
  date: Date;
  isActive: boolean;
  archivedAt: Date | null;
};

type Props = {
  gatherings: Gathering[];
};

type StatusFilter = "ALL" | "ACTIVE" | "INACTIVE";

function ToggleButton({ isActive }: { isActive: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`rounded-xl px-4 py-2.5 text-sm font-bold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 ${
        isActive
          ? "border border-border bg-card text-card-foreground hover:bg-muted"
          : "bg-primary text-primary-foreground"
      }`}
    >
      {pending
        ? "Updating..."
        : isActive
          ? "Deactivate"
          : "Activate"}
    </button>
  );
}

export function GatheringManagement({ gatherings }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [page, setPage] = useState(1);

  const pageSize = 10;

  const filteredGatherings = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return gatherings.filter((gathering) => {
      const matchesSearch = gathering.title
        .toLowerCase()
        .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && gathering.isActive) ||
        (statusFilter === "INACTIVE" && !gathering.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [gatherings, search, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredGatherings.length / pageSize)
  );

  const currentPage = Math.min(page, totalPages);

  const paginatedGatherings = filteredGatherings.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const activeCount = gatherings.filter(
    (gathering) => gathering.isActive
  ).length;

  const inactiveCount = gatherings.length - activeCount;

  function changeSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function changeFilter(value: StatusFilter) {
    setStatusFilter(value);
    setPage(1);
  }

  return (
    <section className="space-y-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="All Gatherings" value={gatherings.length} />
        <StatCard label="Active" value={activeCount} />
        <StatCard label="Inactive" value={inactiveCount} />
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <div className="mb-5">
          <h2 className="text-base font-bold text-card-foreground sm:text-lg">
            All Gatherings
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage attendance access without deleting historical records.
          </p>
        </div>

        <div className="mb-5 grid gap-3 sm:grid-cols-2">
          <input
            type="search"
            value={search}
            onChange={(event) => changeSearch(event.target.value)}
            placeholder="Search gatherings..."
            className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm text-card-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
          />

          <select
            value={statusFilter}
            onChange={(event) =>
              changeFilter(event.target.value as StatusFilter)
            }
            className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm text-card-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
          >
            <option value="ALL">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        {paginatedGatherings.length === 0 ? (
          <p className="rounded-xl border border-border bg-muted p-4 text-sm text-muted-foreground">
            No gatherings match your search.
          </p>
        ) : (
          <div className="space-y-3">
            {paginatedGatherings.map((gathering) => (
              <div
                key={gathering.id}
                className="flex flex-col gap-4 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-bold text-card-foreground">
                    {gathering.title}
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {gathering.date.toLocaleDateString()}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        gathering.isActive
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {gathering.isActive ? "Active" : "Inactive"}
                    </span>

                    {gathering.archivedAt && (
                      <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                        Previously archived
                      </span>
                    )}
                  </div>
                </div>

                <form action={toggleGatheringStatus}>
                  <input
                    type="hidden"
                    name="serviceId"
                    value={gathering.id}
                  />
                  <input
                    type="hidden"
                    name="isActive"
                    value={String(!gathering.isActive)}
                  />

                  <ToggleButton isActive={gathering.isActive} />
                </form>
              </div>
            ))}
          </div>
        )}

        {filteredGatherings.length > pageSize && (
          <div className="mt-5 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages} ·{" "}
              {filteredGatherings.length} gatherings
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setPage((current) => current - 1)}
                className="rounded-xl border border-border px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setPage((current) => current + 1)}
                className="rounded-xl border border-border px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-bold text-card-foreground">{value}</p>
    </div>
  );
}
