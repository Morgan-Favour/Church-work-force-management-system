import { Building2, ClipboardCheck, Users, UserRoundCheck } from "lucide-react";

const stats = [
  {
    label: "Total Workers",
    value: "0",
    icon: Users,
  },
  {
    label: "Departments",
    value: "0",
    icon: Building2,
  },
  {
    label: "Attendance Today",
    value: "0",
    icon: ClipboardCheck,
  },
  {
    label: "Leaders",
    value: "0",
    icon: UserRoundCheck,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-[#0e2d33] p-8 text-white shadow-xl shadow-slate-300/40">
        <p className="text-sm font-medium text-[#d4af37]">
          GIC Egbelu Workforce
        </p>
        <h1 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight">
          Manage departments, workers, attendance, and accountability from one
          place.
        </h1>
        <p className="mt-3 max-w-xl text-sm text-white/65">
          Start by creating departments, adding workers, and recording service
          attendance.
        </p>
      </section>

      <section className="grid grid-cols-4 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  {stat.label}
                </p>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0e2d33]/10 text-[#0e2d33]">
                  <Icon size={21} />
                </div>
              </div>

              <h2 className="mt-5 text-4xl font-bold text-slate-900">
                {stat.value}
              </h2>
            </div>
          );
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-900">
            Recent Activity
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            No activity yet. Activities will appear here after departments,
            workers, and attendance records are created.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900">Quick Actions</h3>

          <div className="mt-5 space-y-3">
            <button className="w-full rounded-xl bg-[#0e2d33] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#123940]">
              Add Department
            </button>
            <button className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Add Worker
            </button>
            <button className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Mark Attendance
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}