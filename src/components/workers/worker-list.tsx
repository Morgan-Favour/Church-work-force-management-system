import Link from "next/link";
import {
  deactivateWorker,
  reactivateWorker,
} from "@/actions/worker.actions";

type WorkerListProps = {
  isAdmin: boolean;
  workers: {
    id: string;
    fullName: string;
    phone: string | null;
    isActive: boolean;
    departments: {
      id: string;
      department: {
        name: string;
      };
    }[];
  }[];
};

export function WorkerList({ workers, isAdmin }: WorkerListProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6">
        <h2 className="text-base font-bold text-slate-900 sm:text-lg">
          Worker List
        </h2>
        <p className="text-sm text-slate-500">
          {workers.length} worker(s) registered
        </p>
      </div>

      {workers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center sm:p-10">
          <p className="font-semibold text-slate-700">No workers yet</p>
          <p className="mt-1 text-sm text-slate-500">
            Add your first worker to begin attendance tracking.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {workers.map((worker) => (
            <div
              key={worker.id}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <Link href={`/workers/${worker.id}`} className="min-w-0 flex-1">
                <h3 className="font-bold text-slate-900">
                  {worker.fullName}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {worker.phone || "No phone number"}
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  {worker.departments.map((item) => (
                    <span
                      key={item.id}
                      className="rounded-full bg-[#0e2d33]/10 px-3 py-1 text-xs font-semibold text-[#0e2d33]"
                    >
                      {item.department.name}
                    </span>
                  ))}
                </div>
              </Link>

              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={
                    worker.isActive
                      ? "w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
                      : "w-fit rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700"
                  }
                >
                  {worker.isActive ? "Active" : "Inactive"}
                </span>

                {isAdmin && worker.isActive && (
                  <form action={deactivateWorker}>
                    <input type="hidden" name="workerId" value={worker.id} />
                    <button
                      type="submit"
                      className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                    >
                      Deactivate
                    </button>
                  </form>
                )}

                {isAdmin && !worker.isActive && (
                  <form action={reactivateWorker}>
                    <input type="hidden" name="workerId" value={worker.id} />
                    <button
                      type="submit"
                      className="rounded-full border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                    >
                      Reactivate
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}