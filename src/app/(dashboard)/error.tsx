"use client";

import { WifiOff } from "lucide-react";

export default function DashboardError({
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="flex min-h-[70vh] items-center justify-center p-4">
            <div className="w-full max-w-lg rounded-3xl border border-destructive/20 bg-card p-8 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                    <WifiOff size={28} />
                </div>

                <h1 className="mt-5 text-2xl font-bold text-card-foreground">
                    Connection problem
                </h1>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    We could not connect to the database. Please check your internet
                    connection and try again.
                </p>

                <button
                    type="button"
                    onClick={() => {
                        try {
                            reset();           // Try Next.js recovery first
                        } catch (e) {
                            window.location.reload(); // Full refresh as fallback
                        }
                    }}
                    className="mt-6 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-colors hover:opacity-90"
                >
                    Try Again
                </button>
            </div>
        </div>
    );
}