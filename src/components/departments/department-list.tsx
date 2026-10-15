"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  deactivateDepartment,
  reactivateDepartment,
} from "@/actions/department.actions";
import { SectionCard } from "@/components/ui/section-card";

const PAGE_SIZE = 10;

type Department = {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
};

export function DepartmentList({
  departments,
}: {
  departments: Department[];
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const filteredDepartments = useMemo(() => {
    const value = search.trim().toLowerCase();

    return departments.filter((department) => {
      const matchesSearch =
        !value ||
        department.name.toLowerCase().includes(value) ||
        department.description?.toLowerCase().includes(value);

      const matchesStatus =
        status === "all" ||
        (status === "active" && department.isActive) ||
        (status === "inactive" && !department.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [departments, search, status]);

  const totalPages = Math.max(1, Math.ceil(filteredDepartments.length / PAGE_SIZE));

  const visibleDepartments = filteredDepartments.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  function resetPage() {
    setPage(1);
  }

  return (
    <SectionCard
      title="Department List"
      description={`Showing ${visibleDepartments.length} of ${filteredDepartments.length} department(s)`}
    >
      {/* Search + Status filters */}
      <div className="mb-6 grid gap-3 sm:grid-cols-[1fr_180px]">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            resetPage();
          }}
          placeholder="Search by name or description..."
          className="rounded-xl border border-input bg-card px-4 py-3 text-sm text-card-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
        />

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

      {departments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center sm:p-10">
          <p className="font-semibold text-card-foreground">No departments yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first department to get started.
          </p>
        </div>
      ) : visibleDepartments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center">
          <p className="font-semibold text-card-foreground">No matching departments</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {visibleDepartments.map((department) => (
              <div
                key={department.id}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
              >
                <Link
                  href={`/departments/${department.id}`}
                  className="min-w-0 flex-1"
                >
                  <h3 className="font-bold text-card-foreground">
                    {department.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {department.description || "No description provided"}
                  </p>
                </Link>

                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={
                      department.isActive
                        ? "w-fit rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
                        : "w-fit rounded-full bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive"
                    }
                  >
                    {department.isActive ? "Active" : "Inactive"}
                  </span>

                  {department.isActive ? (
                    <form action={deactivateDepartment}>
                      <input
                        type="hidden"
                        name="departmentId"
                        value={department.id}
                      />
                      <button
                        type="submit"
                        className="rounded-full border border-destructive/30 px-3 py-1 text-xs font-semibold text-destructive transition hover:bg-destructive/10"
                      >
                        Deactivate
                      </button>
                    </form>
                  ) : (
                    <form action={reactivateDepartment}>
                      <input
                        type="hidden"
                        name="departmentId"
                        value={department.id}
                      />
                      <button
                        type="submit"
                        className="rounded-full border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 transition hover:bg-emerald-500/10"
                      >
                        Reactivate
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
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
    </SectionCard>
  );
}