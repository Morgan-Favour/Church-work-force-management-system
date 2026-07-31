"use client";

import { useState, useTransition } from "react";
import { createLeaderInvite } from "@/actions/leader.actions";
import DepartmentCheckboxDropdown from "../workers/department-checkbox-dropdown";

type Department = {
    id: string;
    name: string;
};

type Props = {
    open: boolean;
    onClose: () => void;
    departments: Department[];
};

export function LeaderInviteModal({
    open,
    onClose,
    departments,
}: Props) {
    const [pending, startTransition] = useTransition();

    const [inviteLink, setInviteLink] = useState("");
    const [error, setError] = useState("");

    if (!open) return null;

    function action(formData: FormData) {
        setError("");
        setInviteLink("");

        startTransition(async () => {
            const result = await createLeaderInvite(formData);

            if (result?.error) {
                setError(result.error);
                return;
            }

            if (result?.inviteLink) {
                setInviteLink(result.inviteLink);
            }
        });
    }

    function closeModal() {
        setError("");
        setInviteLink("");
        onClose();
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">

                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold">
                        Create Leader Invite
                    </h2>

                    <button
                        type="button"
                        onClick={closeModal}
                        className="text-xl font-bold text-slate-500 hover:text-slate-700"
                    >
                        ✕
                    </button>
                </div>

                <form
                    action={(formData) => {
                        setError("");

                        startTransition(async () => {
                            const result = await createLeaderInvite(formData);

                            if (result.error) {
                                setError(result.error);
                                return;
                            }

                            if (result.inviteLink) {
                                setInviteLink(result.inviteLink);
                            }
                        });
                    }}
                    className="space-y-6"
                >

                    <div>
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Department
                            </label>

                            <DepartmentCheckboxDropdown
                                departments={departments}
                                name="departmentId"
                                multiple={false}
                            />
                        </div>

                    </div>

                    {error && (
                        <div className="rounded-lg bg-red-50 p-3 text-red-600">
                            {error}
                        </div>
                    )}

                    {!inviteLink ? (
                        <button
                            disabled={pending}
                            className="w-full rounded-xl bg-[#0e2d33] py-3 font-semibold text-white"
                        >
                            {pending ? "Creating..." : "Create Invite"}
                        </button>
                    ) : (
                        <>
                            <div className="rounded-lg bg-green-50 p-3">
                                Invite created successfully.
                            </div>

                            <input
                                readOnly
                                value={inviteLink}
                                className="w-full rounded-lg border p-3"
                            />

                            <button
                                type="button"
                                onClick={() => navigator.clipboard.writeText(inviteLink)}
                                className="w-full rounded-xl border py-3"
                            >
                                Copy Invite Link
                            </button>
                        </>
                    )}

                </form>

            </div>
        </div>
    );
}