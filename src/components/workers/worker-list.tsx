"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  deactivateWorker,
  reactivateWorker,
} from "@/actions/worker.actions";

const PAGE_SIZE = 10;

type Worker = {
  id: string;
  fullName: string;
  phone: string | null;
  isActive: boolean;
  departments: {
    id: string;
    department: {
      id: string;
      name: string;
    };
  }[];
};

type WorkerListProps = {
  isAdmin: boolean;
  workers: Worker[];
  visibleDepartmentIds?: string[];
};

export function WorkerList({
  workers,
  isAdmin,
  visibleDepartmentIds,
}: WorkerListProps) {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  function getVisibleDepartments(worker: Worker) {
    if (!visibleDepartmentIds) return worker.departments;

    return worker.departments.filter((item) =>
      visibleDepartmentIds.includes(item.department.id)
    );
  }

  const departments = useMemo(() => {
    const names = workers.flatMap((worker) =>
      getVisibleDepartments(worker).map((item) => item.department.name)
    );

    return Array.from(new Set(names)).sort();
  }, [workers, visibleDepartmentIds]);

  const filteredWorkers = useMemo(() => {
    const value = search.trim().toLowerCase();

    return workers.filter((worker) => {
      const visibleDepartments = getVisibleDepartments(worker);

      if (visibleDepartments.length === 0) return false;

      const departmentNames = visibleDepartments.map(
        (item) => item.department.name
      );

      const matchesSearch =
        !value ||
        worker.fullName.toLowerCase().includes(value) ||
        worker.phone?.toLowerCase().includes(value) ||
        departmentNames.join(" ").toLowerCase().includes(value);

      const matchesDepartment =
        department === "all" || departmentNames.includes(department);

      const matchesStatus =
        status === "all" ||
        (status === "active" && worker.isActive) ||
        (status === "inactive" && !worker.isActive);

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [workers, search, department, status, visibleDepartmentIds]);

  const totalPages = Math.max(1, Math.ceil(filteredWorkers.length / PAGE_SIZE));

  const visibleWorkers = filteredWorkers.slice(
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
          Worker Directory
        </h2>

        <p className="text-sm text-muted-foreground">
          Showing {visibleWorkers.length} of {filteredWorkers.length} worker(s)
        </p>
      </div>

      <div className="mb-6 grid gap-3 lg:grid-cols-[1fr_220px_180px]">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            resetPage();
          }}
          placeholder="Search by name, phone, or department..."
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
          {departments.map((name) => (
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

      {workers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center sm:p-10">
          <p className="font-semibold text-card-foreground">No workers yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add your first worker to begin attendance tracking.
          </p>
        </div>
      ) : visibleWorkers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center">
          <p className="font-semibold text-card-foreground">No matching workers</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden overflow-hidden rounded-2xl border border-border lg:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-xs uppercase text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-4 py-3">Worker</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Departments</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border bg-card">
                {visibleWorkers.map((worker) => {
                  const visibleDepartments = getVisibleDepartments(worker);

                  return (
                    <tr key={worker.id} className="transition hover:bg-muted/50">
                      <td className="px-4 py-4">
                        <Link
                          href={`/workers/${worker.id}`}
                          className="font-bold text-card-foreground transition hover:text-primary"
                        >
                          {worker.fullName}
                        </Link>
                      </td>

                      <td className="px-4 py-4 text-muted-foreground">
                        {worker.phone || "No phone"}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          {visibleDepartments.map((item) => (
                            <span
                              key={item.id}
                              className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                            >
                              {item.department.name}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={
                            worker.isActive
                              ? "rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
                              : "rounded-full bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive"
                          }
                        >
                          {worker.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-right">
                        {isAdmin && worker.isActive && (
                          <form action={deactivateWorker}>
                            <input
                              type="hidden"
                              name="workerId"
                              defaultValue={worker.id}
                            />
                            <button className="text-xs font-bold text-destructive transition hover:underline">
                              Deactivate
                            </button>
                          </form>
                        )}

                        {isAdmin && !worker.isActive && (
                          <form action={reactivateWorker}>
                            <input
                              type="hidden"
                              name="workerId"
                              defaultValue={worker.id}
                            />
                            <button className="text-xs font-bold text-emerald-600 dark:text-emerald-400 transition hover:underline">
                              Reactivate
                            </button>
                          </form>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-3 lg:hidden">
            {visibleWorkers.map((worker) => {
              const visibleDepartments = getVisibleDepartments(worker);

              return (
                <div
                  key={worker.id}
                  className="rounded-2xl border border-border bg-card p-4 shadow-sm"
                >
                  <Link href={`/workers/${worker.id}`}>
                    <h3 className="font-bold text-card-foreground">
                      {worker.fullName}
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {worker.phone || "No phone number"}
                    </p>
                  </Link>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {visibleDepartments.map((item) => (
                      <span
                        key={item.id}
                        className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                      >
                        {item.department.name}
                      </span>
                    ))}

                    <span
                      className={
                        worker.isActive
                          ? "rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
                          : "rounded-full bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive"
                      }
                    >
                      {worker.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              );
            })}
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
    </div>
  );
}