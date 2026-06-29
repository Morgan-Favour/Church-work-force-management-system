type WorkerListProps = {
  workers: {
    id: string;
    fullName: string;
    phone: string | null;
    departments: {
      id: string;
      department: {
        name: string;
      };
    }[];
  }[];
};

export function WorkerList({ workers }: WorkerListProps) {
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
            <a
              key={worker.id}
              href={`/workers/${worker.id}`}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
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
              </div>

              <span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                Active
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}