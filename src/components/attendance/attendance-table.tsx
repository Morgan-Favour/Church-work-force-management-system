

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
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6">
        <h2 className="text-base font-bold text-slate-900 sm:text-lg">
          Attendance Sheet
        </h2>

        <p className="text-sm text-slate-500">
          {workers.length} worker(s) available for{" "}
          {selectedDepartmentName || "this department"}.
        </p>
      </div>

      {!selectedServiceId ? (
        <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-700">
          Please create or select a gathering first.
        </p>
      ) : !selectedDepartmentId ? (
        <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-700">
          Please select a department first.
        </p>
      ) : workers.length === 0 ? (
        <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
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
              <div
                key={worker.id}
                className={
                  saved
                    ? "rounded-2xl border border-emerald-200 bg-emerald-50/40 p-3"
                    : "rounded-2xl border border-red-200 bg-red-50/40 p-3"
                }
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-sm font-bold text-slate-900">
                    {worker.fullName}
                  </p>

                  <span
                    className={
                      saved
                        ? "rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700"
                        : "rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700"
                    }
                  >
                    {saved ? saved.status : "Not marked"}
                  </span>
                </div>

                <AttendanceRow worker={worker} savedStatus={saved?.status} />
              </div>
            );
          })}

          <button
            type="submit"
            className="w-full rounded-xl bg-[#0e2d33] px-4 py-3 text-sm font-bold text-white hover:bg-[#123940]"
          >
            Save Attendance
          </button>
        </form>
      )}
    </section>
  );
}