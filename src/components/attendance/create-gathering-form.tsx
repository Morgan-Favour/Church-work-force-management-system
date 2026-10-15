import { ClipboardCheck } from "lucide-react";
import { createService } from "@/actions/attendance.actions";

type CreateGatheringFormProps = {
  message?: string;
};

export function CreateGatheringForm({ message }: CreateGatheringFormProps) {
  const feedback =
    message === "gathering-exists"
      ? {
        title: "Gathering already exists",
        text: "A gathering with this same name and date already exists.",
        className: "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
      }
      : message === "gathering-created"
        ? {
          title: "Gathering created",
          text: "The new gathering is now selected.",
          className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        }
        : null;

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <ClipboardCheck size={22} />
        </div>

        <div>
          <h2 className="text-base font-bold text-card-foreground sm:text-lg">
            Create Gathering
          </h2>

          <p className="text-sm text-muted-foreground">
            Example: Sunday Service, Wednesday Service, Workers Meeting.
          </p>
        </div>
      </div>

      {feedback && (
        <div className={`mb-5 rounded-2xl border p-4 ${feedback.className}`}>
          <p className="text-sm font-bold">{feedback.title}</p>
          <p className="mt-1 text-sm">{feedback.text}</p>
        </div>
      )}

      <form action={createService} className="grid gap-4 md:grid-cols-3">
        <input
          name="title"
          required
          placeholder="Sunday Service"
          className="rounded-xl border border-input bg-card px-4 py-3 text-sm text-card-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
        />

        <input
          name="date"
          type="date"
          required
          className="rounded-xl border border-input bg-card px-4 py-3 text-sm text-card-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
        />

        <button
          type="submit"
          className="rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90"
        >
          Create Gathering
        </button>
      </form>
    </section>
  );
}