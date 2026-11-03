
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { assignLeaderDepartment } from "@/actions/leader.actions";

type Department = {
    id: string;
    name: string;
};

type Props = {
    open: boolean;
    onClose: () => void;
    leaderId: string;
    leaderName: string;
    departments: Department[];
    occupiedDepartmentIds: string[];
};

export function AssignLeaderDepartmentModal({
    open,
    onClose,
    leaderId,
    leaderName,
    departments,
    occupiedDepartmentIds,
}: Props) {
    const router = useRouter();

    const [departmentId, setDepartmentId] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    if (!open) return null;

    const availableDepartments = departments.filter(
        (department) => !occupiedDepartmentIds.includes(department.id)
    );

    async function handleSubmit(formData: FormData) {
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const result = await assignLeaderDepartment(formData);

            if ("error" in result) {
                setError(result.error);
                return;
            }

            if ("success" in result) {
                setSuccess(result.success);
                setDepartmentId("");
                router.refresh();
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="assign-department-title"
                className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="mb-5">
                    <h2
                        id="assign-department-title"
                        className="text-lg font-bold text-card-foreground"
                    >
                        Assign Department
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Assign another department to {leaderName}&apos;s existing account.
                    </p>
                </div>

                <form action={handleSubmit} className="space-y-4">
                    <input type="hidden" name="leaderId" value={leaderId} />

                    <div>
                        <label
                            htmlFor="departmentId"
                            className="mb-2 block text-sm font-semibold text-card-foreground"
                        >
                            Select Department
                        </label>

                        <select
                            id="departmentId"
                            name="departmentId"
                            value={departmentId}
                            onChange={(event) => setDepartmentId(event.target.value)}
                            required
                            disabled={loading || availableDepartments.length === 0}
                            className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-card-foreground outline-none focus:border-primary"
                        >
                            <option value="">Choose a department</option>

                            {availableDepartments.map((department) => (
                                <option key={department.id} value={department.id}>
                                    {department.name}
                                </option>
                            ))}
                        </select>

                        {availableDepartments.length === 0 && (
                            <p className="mt-2 text-sm text-muted-foreground">
                                There are currently no departments available for assignment.
                            </p>
                        )}
                    </div>

                    {error && (
                        <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                            {error}
                        </p>
                    )}

                    {success && (
                        <p className="rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-600">
                            {success}
                        </p>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-card-foreground hover:bg-muted"
                        >
                            Close
                        </button>

                        <button
                            type="submit"
                            disabled={loading || !departmentId || availableDepartments.length === 0}
                            className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? "Assigning..." : "Assign Department"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
