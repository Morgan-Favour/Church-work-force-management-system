
"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createG12, type G12Field } from "@/actions/g12.actions";
import { Save, Users } from "lucide-react";

type FieldErrors = Partial<Record<G12Field, string>>;

const inputClass =
    "mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:ring-2 focus:ring-ring";

const labelClass = "text-sm font-semibold text-foreground";

function FieldError({ message }: { message?: string }) {
    if (!message) return null;

    return (
        <p className="mt-1.5 text-sm text-destructive" role="alert">
            {message}
        </p>
    );
}

export default function G12Form() {
    const router = useRouter();
    const formRef = useRef<HTMLFormElement>(null);

    const [isPending, startTransition] = useTransition();
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    function handleSubmit(formData: FormData) {
        setError("");
        setSuccess("");
        setFieldErrors({});

        startTransition(async () => {
            try {
                const result = await createG12(formData);

                if (result.fieldErrors) {
                    setFieldErrors(result.fieldErrors);
                }

                if (result.error) {
                    setError(result.error);
                    return;
                }

                if (result.success) {
                    setSuccess(result.success);
                    formRef.current?.reset();
                    router.refresh();
                }
            } catch {
                setError("Unable to create the G12. Please try again.");
            }
        });
    }

    return (
        <form
            ref={formRef}
            action={handleSubmit}
            className="space-y-6"
        >
            <section className="rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm sm:p-6">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-primary/10 p-3 text-primary">
                        <Users size={22} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">
                            G12 information
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Enter the groups name and meeting location.
                        </p>
                    </div>
                </div>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    <div>
                        <label className={labelClass} htmlFor="name">
                            G12 name *
                        </label>
                        <input
                            id="name"
                            name="name"
                            required
                            maxLength={100}
                            placeholder="e.g. Faith G12"
                            className={inputClass}
                            aria-invalid={!!fieldErrors.name}
                        />
                        <FieldError message={fieldErrors.name} />
                    </div>

                    <div>
                        <label
                            className={labelClass}
                            htmlFor="hostLocation"
                        >
                            Host location *
                        </label>
                        <input
                            id="hostLocation"
                            name="hostLocation"
                            required
                            maxLength={200}
                            placeholder="e.g. Egbelu, Port Harcourt"
                            className={inputClass}
                            aria-invalid={!!fieldErrors.hostLocation}
                        />
                        <FieldError
                            message={fieldErrors.hostLocation}
                        />
                    </div>

                    <div>
                        <label className={labelClass} htmlFor="hostName">
                            Host name *
                        </label>
                        <input
                            id="hostName"
                            name="hostName"
                            required
                            maxLength={100}
                            placeholder="Enter the host's full name"
                            className={inputClass}
                            aria-invalid={!!fieldErrors.hostName}
                        />
                        <FieldError message={fieldErrors.hostName} />
                    </div>

                    <div>
                        <label
                            className={labelClass}
                            htmlFor="leaderName"
                        >
                            G12 leader *
                        </label>
                        <input
                            id="leaderName"
                            name="leaderName"
                            required
                            maxLength={100}
                            placeholder="Enter the leader's full name"
                            className={inputClass}
                            aria-invalid={!!fieldErrors.leaderName}
                        />
                        <FieldError message={fieldErrors.leaderName} />
                    </div>
                </div>
            </section>

            <section className="rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm sm:p-6">
                <h2 className="text-lg font-bold">
                    Contact information
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    These details can belong to the host or the G12 leader.
                </p>

                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <div>
                        <label
                            className={labelClass}
                            htmlFor="contactPerson"
                        >
                            Contact person *
                        </label>
                        <select
                            id="contactPerson"
                            name="contactPerson"
                            defaultValue="LEADER"
                            required
                            className={inputClass}
                            aria-invalid={!!fieldErrors.contactPerson}
                        >
                            <option value="LEADER">G12 leader</option>
                            <option value="HOST">Host</option>
                        </select>
                        <FieldError
                            message={fieldErrors.contactPerson}
                        />
                    </div>

                    <div>
                        <label
                            className={labelClass}
                            htmlFor="contactPhone"
                        >
                            Contact phone number *
                        </label>
                        <input
                            id="contactPhone"
                            name="contactPhone"
                            type="tel"
                            inputMode="tel"
                            autoComplete="tel"
                            required
                            placeholder="+2348144543193"
                            className={inputClass}
                            aria-invalid={!!fieldErrors.contactPhone}
                        />
                        <FieldError
                            message={fieldErrors.contactPhone}
                        />
                    </div>

                    <div>
                        <label
                            className={labelClass}
                            htmlFor="contactWhatsApp"
                        >
                            WhatsApp number
                        </label>
                        <input
                            id="contactWhatsApp"
                            name="contactWhatsApp"
                            type="tel"
                            inputMode="tel"
                            placeholder="Optional"
                            className={inputClass}
                            aria-invalid={!!fieldErrors.contactWhatsApp}
                        />
                        <FieldError
                            message={fieldErrors.contactWhatsApp}
                        />
                    </div>

                    <div>
                        <label
                            className={labelClass}
                            htmlFor="contactEmail"
                        >
                            Contact email
                        </label>
                        <input
                            id="contactEmail"
                            name="contactEmail"
                            type="email"
                            autoComplete="email"
                            placeholder="Optional"
                            className={inputClass}
                            aria-invalid={!!fieldErrors.contactEmail}
                        />
                        <FieldError
                            message={fieldErrors.contactEmail}
                        />
                    </div>
                </div>
            </section>

            {error && (
                <p
                    role="alert"
                    className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm font-medium text-destructive"
                >
                    {error}
                </p>
            )}

            {success && (
                <p
                    role="status"
                    className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-600 dark:text-emerald-400"
                >
                    {success}
                </p>
            )}

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <Save size={17} />
                    {isPending ? "Creating G12..." : "Create G12"}
                </button>
            </div>
        </form>
    );
}
