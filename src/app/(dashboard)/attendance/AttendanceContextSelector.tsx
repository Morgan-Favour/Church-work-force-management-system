"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2, AlertTriangle, CircleMinus } from "lucide-react";

type DepartmentStatus = "Marked" | "Partial" | "Pending" | "No workers";

type Props = {
  services: {
    id: string;
    title: string;
    date: string;
  }[];

  departments: {
    id: string;
    name: string;
    status: DepartmentStatus;
  }[];

  selectedServiceId?: string;
  selectedDepartmentId?: string;
  selectedDepartmentName?: string;

  attendanceStatus: string;
  attendanceStatusClass: string;

  markedCount: number;
  totalWorkers: number;
};

export default function AttendanceContextSelector({
  services,
  departments,
  selectedServiceId,
  selectedDepartmentId,
  selectedDepartmentName,
  attendanceStatus,
  attendanceStatusClass,
  markedCount,
  totalWorkers,
}: Props) {
  const router = useRouter();

  const [serviceId, setServiceId] = useState(selectedServiceId || "");
  const [departmentId, setDepartmentId] = useState(selectedDepartmentId || "");

  function updatePage(nextServiceId: string, nextDepartmentId: string) {
    if (!nextServiceId || !nextDepartmentId) return;

    router.replace(
      `/attendance?serviceId=${nextServiceId}&departmentId=${nextDepartmentId}`,
      { scroll: false }
    );
  }

  const StatusIcon =
    attendanceStatus === "Marked"
      ? CheckCircle2
      : attendanceStatus === "Partially marked"
      ? AlertTriangle
      : CircleMinus;

  function getStatusEmoji(status: DepartmentStatus) {
    if (status === "Marked") return "🟢";
    if (status === "Partial") return "🟡";
    if (status === "Pending") return "🔴";
    return "⚪";
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-base font-bold text-slate-900 sm:text-lg">
        Select Attendance Context
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Workers load automatically when you select a gathering or department.
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <select
          value={serviceId}
          onChange={(e) => {
            const nextServiceId = e.target.value;
            setServiceId(nextServiceId);
            updatePage(nextServiceId, departmentId);
          }}
          className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#0e2d33] focus:ring-4 focus:ring-[#0e2d33]/10"
        >
          {services.length === 0 ? (
            <option value="">No gathering created</option>
          ) : (
            services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.title} - {service.date}
              </option>
            ))
          )}
        </select>

        <select
          value={departmentId}
          onChange={(e) => {
            const nextDepartmentId = e.target.value;
            setDepartmentId(nextDepartmentId);
            updatePage(serviceId, nextDepartmentId);
          }}
          className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#0e2d33] focus:ring-4 focus:ring-[#0e2d33]/10"
        >
          {departments.length === 0 ? (
            <option value="">No department available</option>
          ) : (
            departments.map((department) => (
              <option key={department.id} value={department.id}>
                {getStatusEmoji(department.status)} {department.name} —{" "}
                {department.status}
              </option>
            ))
          )}
        </select>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div
          className={`flex items-center gap-3 rounded-2xl border px-4 py-4 ${attendanceStatusClass}`}
        >
          <StatusIcon size={20} />

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide">
              Attendance Status
            </p>
            <p className="mt-1 text-sm font-bold">
              {attendanceStatus} · {markedCount}/{totalWorkers} workers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-[#0e2d33]/20 bg-[#0e2d33]/5 px-4 py-4 text-[#0e2d33]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide">
              Department
            </p>
            <p className="mt-1 text-sm font-bold">
              {selectedDepartmentName || "No department selected"} ·{" "}
              {totalWorkers} workers
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}