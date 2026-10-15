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
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 transition hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <input type="hidden" name="workerIds" value={worker.id} />

        <h3 className="font-bold text-card-foreground">{worker.fullName}</h3>

        <p className="text-sm text-muted-foreground">
          {worker.phone || "No phone number"}
        </p>

        <a
          href={`/workers/${worker.id}`}
          className="mt-2 inline-block text-xs font-bold text-primary hover:underline"
        >
          View profile
        </a>
      </div>

      <select
        name={`status-${worker.id}`}
        defaultValue={savedStatus || "PRESENT"}
        className="rounded-xl border border-input bg-card px-4 py-2 text-sm text-card-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
      >
        <option value="PRESENT">Present</option>
        <option value="LATE">Late</option>
        <option value="ABSENT">Absent</option>
        <option value="EXCUSED">Excused</option>
      </select>
    </div>
  );
}