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
            <div className="w-full max-w-lg rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-700">
                    <WifiOff size={28} />
                </div>

                <h1 className="mt-5 text-2xl font-bold text-slate-900">
                    Connection problem
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-500">
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
                    className="mt-6 rounded-xl bg-[#0e2d33] px-5 py-3 text-sm font-bold text-white hover:bg-[#123940]"
                >
                    Try Again
                </button>
            </div>
        </div>
    );
}