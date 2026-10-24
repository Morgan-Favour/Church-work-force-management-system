"use client";

import { AttendanceStatus } from "@prisma/client";
import { markAttendance } from "@/actions/attendance.actions";
import { AttendanceRow } from "./attendance-row";
import { useFormStatus } from "react-dom";

type AttendanceTableProps = {
  selectedServiceId?: string;
  selectedDepartmentId?: string | null;
  selectedDepartmentName?: string;
  markedBy: string;
  workers: {
    id: string;
    fullName: string;
    phone: string | null;
  }[];
  existingAttendance: {
    workerId: string;
    status: AttendanceStatus;
  }[];
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Saving..." : "Save Attendance"}
    </button>
  );
}

export function AttendanceTable({
  selectedServiceId,
  selectedDepartmentId,
  selectedDepartmentName,
  markedBy,
  workers,
  existingAttendance,
}: AttendanceTableProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-6">
        <h2 className="text-base font-bold text-card-foreground sm:text-lg">
          Attendance Sheet
        </h2>

        <p className="text-sm text-muted-foreground">
          {workers.length} worker(s) available for{" "}
          {selectedDepartmentName || "this department"}.
        </p>
      </div>

      {!selectedServiceId ? (
        <p className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-600 dark:text-amber-400">
          Please create or select a gathering first.
        </p>
      ) : !selectedDepartmentId ? (
        <p className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-600 dark:text-amber-400">
          Please select a department first.
        </p>
      ) : workers.length === 0 ? (
        <p className="rounded-xl border border-border bg-muted p-4 text-sm text-muted-foreground">
          No workers found for this department.
        </p>
      ) : (
        <form action={markAttendance} className="space-y-4">
          <input type="hidden" name="serviceId" value={selectedServiceId} />
          <input
            type="hidden"
            name="departmentId"
            value={selectedDepartmentId}
          />
          <input type="hidden" name="markedBy" value={markedBy} />

          {workers.map((worker) => {
            const saved = existingAttendance.find(
              (item) => item.workerId === worker.id
            );

            return (
              <div
                key={worker.id}
                className={
                  saved
                    ? "rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3"
                    : "rounded-2xl border border-destructive/30 bg-destructive/10 p-3"
                }
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-sm font-bold text-card-foreground">
                    {worker.fullName}
                  </p>

                  <span
                    className={
                      saved
                        ? "rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400"
                        : "rounded-full bg-destructive/20 px-3 py-1 text-xs font-bold text-destructive"
                    }
                  >
                    {saved ? saved.status : "Not marked"}
                  </span>
                </div>

                <AttendanceRow worker={worker} savedStatus={saved?.status} />
              </div>
            );
          })}

          <SubmitButton />
        </form>
      )}
    </section>
  );
}