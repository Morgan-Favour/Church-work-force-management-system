"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { WifiOff } from "lucide-react";

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleRetry() {
    startTransition(() => {
      // 1. Tell Next.js to re-fetch Server Components & data from server
      router.refresh();
      // 2. Reset the error boundary state
      reset();
    });
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive">
          <WifiOff size={28} />
        </div>

        <h1 className="mt-5 text-2xl font-bold tracking-tight text-card-foreground">
          Connection problem
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          We could not connect you right now. Please check your internet
          connection and try again.
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <button
            type="button"
            disabled={isPending}
            onClick={handleRetry}
            className="w-full rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-sm transition hover:opacity-90 disabled:opacity-60"
          >
            {isPending ? "Retrying..." : "Try Again"}
          </button>

          {/* <button
            type="button"
            onClick={() => window.location.reload()}
            className="w-full rounded-xl border border-border bg-card px-5 py-2.5 text-xs font-semibold text-muted-foreground transition hover:bg-muted"
          >
            Reload full page
          </button> */}
        </div>
      </div>
    </div>
  );
}