import { AttendanceStatus } from "@prisma/client";

type AttendanceRowProps = {
  worker: {
    id: string;
    fullName: string;
    phone: string | null;
  };
  savedStatus?: AttendanceStatus;
};

export function AttendanceRow({ worker, savedStatus }: AttendanceRowProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <input type="hidden" name="workerIds" value={worker.id} />

        <h3 className="font-bold text-slate-900">{worker.fullName}</h3>

        <p className="text-sm text-slate-500">
          {worker.phone || "No phone number"}
        </p>

        <a
          href={`/workers/${worker.id}`}
          className="mt-2 inline-block text-xs font-bold text-[#0e2d33] hover:underline"
        >
          View profile
        </a>
      </div>

      <select
        name={`status-${worker.id}`}
        defaultValue={savedStatus || "PRESENT"}
        className="rounded-xl border border-slate-300 px-4 py-2 text-sm outline-none focus:border-[#0e2d33] focus:ring-4 focus:ring-[#0e2d33]/10"
      >
        <option value="PRESENT">Present</option>
        <option value="LATE">Late</option>
        <option value="ABSENT">Absent</option>
        <option value="EXCUSED">Excused</option>
      </select>
    </div>
  );
}