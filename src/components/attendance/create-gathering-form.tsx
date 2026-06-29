import { ClipboardCheck } from "lucide-react";
import { createService } from "@/actions/attendance.actions";

export function CreateGatheringForm() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0e2d33]/10 text-[#0e2d33]">
          <ClipboardCheck size={22} />
        </div>

        <div>
          <h2 className="text-base font-bold text-slate-900 sm:text-lg">
            Create Gathering
          </h2>

          <p className="text-sm text-slate-500">
            Example: Sunday Service, Wednesday Service, Workers Meeting.
          </p>
        </div>
      </div>

      <form action={createService} className="grid gap-4 md:grid-cols-3">
        <input
          name="title"
          required
          placeholder="Sunday Service"
          className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#0e2d33] focus:ring-4 focus:ring-[#0e2d33]/10"
        />

        <input
          name="date"
          type="date"
          required
          className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#0e2d33] focus:ring-4 focus:ring-[#0e2d33]/10"
        />

        <button
          type="submit"
          className="rounded-xl bg-[#0e2d33] px-4 py-3 text-sm font-bold text-white hover:bg-[#123940]"
        >
          Create Gathering
        </button>
      </form>
    </section>
  );
}