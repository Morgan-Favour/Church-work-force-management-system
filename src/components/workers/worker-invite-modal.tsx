"use client";

import { useState, useTransition } from "react";
import { createWorkerInvite } from "@/actions/worker.actions";
import DepartmentCheckboxDropdown from "./department-checkbox-dropdown";

type Department = {
    id: string;
    name: string;
};

type Props = {
    open: boolean;
    onClose: () => void;
    departments: Department[];
};

export function WorkerInviteModal({
    open,
    onClose,
    departments,
}: Props) {
    const [pending, startTransition] = useTransition();
    const [message, setMessage] = useState("");
    const [inviteLink, setInviteLink] = useState("");

    if (!open) return null;

    function action(formData: FormData) {
        setMessage("");
        setInviteLink("");

        startTransition(async () => {
            const result = await createWorkerInvite(formData);

            if (result?.error) {
                setMessage(result.error);
                return;
            }

            setMessage(result?.success ?? "Invite created.");
            setInviteLink(result?.inviteLink ?? "");
        });
    }

    async function copyLink() {
        if (!inviteLink) return;

        await navigator.clipboard.writeText(inviteLink);

        setMessage("Invite link copied.");
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold">
                        Invite Worker
                    </h2>

                    <button onClick={onClose}>
                        ✕
                    </button>
                </div>

                <form action={action} className="space-y-5">
                    <div>
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Departments
                            </label>

                            <DepartmentCheckboxDropdown
                                departments={departments}
                                name="departmentIds"
                            />
                        </div>
                    </div>

                    {message && (
                        <div className="rounded-lg bg-slate-100 p-3 text-sm">
                            {message}
                        </div>
                    )}

                    {inviteLink && (
                        <div className="space-y-3 rounded-lg border bg-slate-50 p-4">
                            <input
                                readOnly
                                value={inviteLink}
                                className="w-full rounded-lg border bg-white p-3 text-sm"
                            />

                            <button
                                type="button"
                                onClick={copyLink}
                                className="w-full rounded-xl border py-3 font-medium"
                            >
                                Copy Invite Link
                            </button>
                        </div>
                    )}

                    <button
                        disabled={pending}
                        className="w-full rounded-xl bg-[#0e2d33] py-3 font-semibold text-white"
                    >
                        {pending ? "Creating..." : "Generate Invite Link"}
                    </button>
                </form>
            </div>
        </div>
    );
}