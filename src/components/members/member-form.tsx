"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UserPlus } from "lucide-react";
import { createMember } from "@/actions/member.actions";

type Option = {
    id: string;
    name: string;
};

type MemberFormProps = {
    departments: Option[];
    g12Groups: Option[];
};

export default function MemberForm({
    departments,
    g12Groups,
}: MemberFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const formRef = useRef<HTMLFormElement>(null);

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError("");
        setSuccess("");

        const form = event.currentTarget;
        const formData = new FormData(form);

        startTransition(async () => {
            try {
                const result = await createMember(formData);

                if (result.error) {
                    setError(result.error);
                    return;
                }

                setSuccess(result.success ?? "Member added successfully.");

                form.reset();
                router.push("/members");
                router.refresh();
            } catch (error) {
                console.error("Submit member error:", error);
                setError("Something went wrong. Please try again.");
            }
        });
    }

    const inputClass =
        "w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-card-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10";

    const labelClass =
        "mb-2 block text-sm font-semibold text-card-foreground";

    return (
        <div className="mx-auto max-w-5xl space-y-6 pb-10">
            <div>
                <Link
                    href="/members"
                    className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-card-foreground"
                >
                    <ArrowLeft size={16} />
                    Back to members
                </Link>

                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <UserPlus size={24} />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-card-foreground">
                            Add New Member
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Register a member of GIC Egbelu Church.
                        </p>
                    </div>
                </div>
            </div>

            {error && (
                <div
                    role="alert"
                    className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm font-semibold text-destructive shadow-sm"
                >
                    {error}
                </div>
            )}

            {success && (
                <div
                    role="status"
                    className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-semibold text-emerald-600 dark:text-emerald-400 shadow-sm"
                >
                    {success}
                </div>
            )}

            <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="space-y-6"
            >
                <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
                    <h2 className="mb-5 text-lg font-bold text-card-foreground">
                        Personal Information
                    </h2>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <label htmlFor="fullName" className={labelClass}>
                                Full Name *
                            </label>
                            <input
                                id="fullName"
                                name="fullName"
                                required
                                autoComplete="name"
                                className={inputClass}
                                placeholder="Enter full name"
                            />
                        </div>

                        <div>
                            <label htmlFor="gender" className={labelClass}>
                                Gender *
                            </label>
                            <select
                                id="gender"
                                name="gender"
                                required
                                defaultValue=""
                                className={inputClass}
                            >
                                <option value="" disabled>
                                    Select gender
                                </option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="dateOfBirth" className={labelClass}>
                                Date of Birth *
                            </label>
                            <input
                                id="dateOfBirth"
                                name="dateOfBirth"
                                type="date"
                                required
                                max={new Date().toLocaleDateString("en-CA")}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label htmlFor="maritalStatus" className={labelClass}>
                                Marital Status *
                            </label>
                            <select
                                id="maritalStatus"
                                name="maritalStatus"
                                required
                                defaultValue=""
                                className={inputClass}
                            >
                                <option value="" disabled>
                                    Select marital status
                                </option>
                                <option value="Single">Single</option>
                                <option value="Married">Married</option>
                                <option value="Divorced">Divorced</option>
                                <option value="Widowed">Widowed</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="occupation" className={labelClass}>
                                Occupation *
                            </label>
                            <input
                                id="occupation"
                                name="occupation"
                                required
                                className={inputClass}
                                placeholder="e.g. Teacher, Student, Trader"
                            />
                        </div>
                    </div>
                </section>

                <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
                    <h2 className="mb-5 text-lg font-bold text-card-foreground">
                        Contact Information
                    </h2>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label htmlFor="phone" className={labelClass}>
                                Phone Number *
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                required
                                inputMode="numeric"
                                autoComplete="tel"
                                className={inputClass}
                                placeholder="e.g. 08012345678"
                            />
                        </div>

                        <div>
                            <label htmlFor="whatsappNo" className={labelClass}>
                                WhatsApp Number
                            </label>
                            <input
                                id="whatsappNo"
                                name="whatsappNo"
                                type="tel"
                                inputMode="numeric"
                                className={inputClass}
                                placeholder="Optional"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="email" className={labelClass}>
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                className={inputClass}
                                placeholder="Optional"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="address" className={labelClass}>
                                Residential Address *
                            </label>
                            <textarea
                                id="address"
                                name="address"
                                required
                                rows={3}
                                autoComplete="street-address"
                                className={`${inputClass} resize-none`}
                                placeholder="Enter residential address"
                            />
                        </div>
                    </div>
                </section>

                <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
                    <h2 className="mb-5 text-lg font-bold text-card-foreground">
                        Church Information
                    </h2>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label htmlFor="dateJoined" className={labelClass}>
                                Date Joined Church *
                            </label>
                            <input
                                id="dateJoined"
                                name="dateJoined"
                                type="date"
                                required
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label htmlFor="departmentId" className={labelClass}>
                                Department
                            </label>
                            <select
                                id="departmentId"
                                name="departmentId"
                                defaultValue=""
                                className={inputClass}
                            >
                                <option value="">No department assigned</option>
                                {departments.map((department) => (
                                    <option key={department.id} value={department.id}>
                                        {department.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="g12Id" className={labelClass}>
                                G12 Group
                            </label>
                            <select
                                id="g12Id"
                                name="g12Id"
                                defaultValue=""
                                className={inputClass}
                            >
                                <option value="">No G12 group assigned</option>
                                {g12Groups.map((group) => (
                                    <option key={group.id} value={group.id}>
                                        {group.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </section>

                <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
                    <Link
                        href="/members"
                        className="rounded-xl border border-border bg-card px-5 py-3 text-center text-sm font-bold text-card-foreground transition hover:bg-muted/50"
                    >
                        Cancel
                    </Link>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <UserPlus size={17} />
                        {isPending ? "Saving Member..." : "Add Member"}
                    </button>
                </div>
            </form>
        </div>
    );
}