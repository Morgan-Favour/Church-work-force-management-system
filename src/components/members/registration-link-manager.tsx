"use client";

import { useState, useActionState } from "react";
import { generateRegistrationLink } from "@/actions/registration-link-actions";

type RegistrationLinkState = {
    error?: string;
    success?: string;
};

type RegistrationLinkManagerProps = {
    currentUrl: string | null;
    createdAt: string | null;
};

const initialState: RegistrationLinkState = {};

export default function RegistrationLinkManager({
    currentUrl,
    createdAt,
}: RegistrationLinkManagerProps) {
    const [state, formAction, isPending] = useActionState<
        RegistrationLinkState,
        FormData
    >(generateRegistrationLink, initialState);
    const [copyMessage, setCopyMessage] = useState("");

    async function copyLink() {
        if (!currentUrl) return;

        try {
            await navigator.clipboard.writeText(currentUrl);
            setCopyMessage("Link copied to clipboard.");
        } catch {
            setCopyMessage("Copy failed. Select and copy the link manually.");
        }
    }

    return (
        <div className="space-y-6">
            <section className="rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm sm:p-6">
                <h2 className="text-lg font-bold tracking-tight">Current registration link</h2>

                {currentUrl ? (
                    <>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Anyone with this link can open the public member registration
                            form. Regenerating the link will invalidate this one.
                        </p>

                        <div className="mt-4 break-all rounded-xl border border-border bg-muted/50 p-3 text-sm font-mono text-card-foreground">
                            {currentUrl}
                        </div>

                        {createdAt && (
                            <p className="mt-3 text-xs text-muted-foreground">
                                Generated on{" "}
                                {new Date(createdAt).toLocaleString()}
                            </p>
                        )}

                        <button
                            type="button"
                            onClick={copyLink}
                            className="mt-4 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-bold text-card-foreground shadow-sm transition hover:bg-muted/50"
                        >
                            Copy registration link
                        </button>

                        {copyMessage && (
                            <p className="mt-2 text-sm text-muted-foreground" role="status">
                                {copyMessage}
                            </p>
                        )}
                    </>
                ) : (
                    <p className="mt-2 text-sm text-muted-foreground">
                        There is no active registration link yet. Generate one below to
                        allow public registration.
                    </p>
                )}
            </section>

            <section className="rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm sm:p-6">
                <h2 className="text-lg font-bold tracking-tight">Generate a new link</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    The previous link will stop working once a new link is generated.
                    Anyone trying to use the old link will be asked to request the
                    current one from the church.
                </p>

                {state.error && (
                    <p
                        role="alert"
                        className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm font-semibold text-destructive"
                    >
                        {state.error}
                    </p>
                )}

                {state.success && (
                    <p
                        role="status"
                        className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm font-semibold text-emerald-600 dark:text-emerald-400"
                    >
                        {state.success}
                    </p>
                )}

                <form action={formAction} className="mt-4">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isPending
                            ? "Generating link..."
                            : currentUrl
                                ? "Regenerate registration link"
                                : "Generate registration link"}
                    </button>
                </form>
            </section>
        </div>
    );
}