import { AttendanceStatus } from "@prisma/client";
import { markAttendance } from "@/actions/attendance.actions";
import { AttendanceRow } from "./attendance-row";

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

export function AttendanceTable({
  selectedServiceId,
  selectedDepartmentId,
  selectedDepartmentName,
  markedBy,
  workers,
  existingAttendance,
}: AttendanceTableProps) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
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
        <p className="rounded-xl bg-amber-500/10 p-4 text-sm text-amber-600 dark:text-amber-400">
          Please create or select a gathering first.
        </p>
      ) : !selectedDepartmentId ? (
        <p className="rounded-xl bg-amber-500/10 p-4 text-sm text-amber-600 dark:text-amber-400">
          Please select a department first.
        </p>
      ) : workers.length === 0 ? (
        <p className="rounded-xl bg-muted p-4 text-sm text-muted-foreground">
          No workers found for this department.
        </p>
      ) : (
        <form action={markAttendance} className="space-y-4">
          <input type="hidden" name="serviceId" value={selectedServiceId} />
          <input type="hidden" name="departmentId" value={selectedDepartmentId} />
          <input type="hidden" name="markedBy" value={markedBy} />

          {workers.map((worker) => {
            const saved = existingAttendance.find(
              (item) => item.workerId === worker.id
            );

            return (
              <AttendanceRow
                key={worker.id}
                worker={worker}
                savedStatus={saved?.status}
              />
            );
          })}

          <button
            type="submit"
            className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition-colors hover:opacity-90"
          >
            Save Attendance
          </button>
        </form>
      )}
    </section>
  );
}