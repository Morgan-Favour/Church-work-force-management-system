"use client";

import { useState, useTransition } from "react";
import { createWorkerInvite } from "@/actions/worker.actions";
import DepartmentCheckboxDropdown from "./department-checkbox-dropdown";
import Modal from "../ui/modal";
import { ModalHeader } from "../ui/modal-header";
import { ModalBody } from "../ui/modal-body";
import { ModalFooter } from "../ui/modal-footer";

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

  const [inviteLink, setInviteLink] = useState("");
  const [error, setError] = useState("");

  function closeModal() {
    setInviteLink("");
    setError("");
    onClose();
  }

  function action(formData: FormData) {
    setInviteLink("");
    setError("");

    startTransition(async () => {
      const result = await createWorkerInvite(formData);

      if (result?.error) {
        setError(result.error);
        return;
      }

      if (result?.inviteLink) {
        setInviteLink(result.inviteLink);
      }
    });
  }

  async function copyLink() {
    await navigator.clipboard.writeText(inviteLink);

    setTimeout(() => {
      closeModal();
    }, 500);
  }

  return (
    <Modal open={open} onClose={closeModal} size="lg">
      {/* Wrap the whole modal content in the form and use flex layout */}
      <form action={action} className="flex flex-col h-full">
        <ModalHeader
          title="Invite Worker"
          description="Generate a secure registration link for one or more departments."
          onClose={closeModal}
        />

        {/* Use overflow-visible so the dropdown list can expand freely */}
        <ModalBody>
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-card-foreground">
                Department(s)
              </label>

              <DepartmentCheckboxDropdown
                departments={departments}
                name="departmentIds"
                multiple
              />
            </div>

            {error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm font-semibold text-destructive">
                {error}
              </div>
            )}
          </div>
        </ModalBody>

        <ModalFooter>
          {!inviteLink ? (
            <div className="w-full space-y-3">
              <button
                type="submit"
                disabled={pending}
                className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pending ? "Generating Invite..." : "Generate Invite Link"}
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="w-full rounded-xl border border-border bg-card py-3 text-sm font-bold text-card-foreground transition hover:bg-muted/50"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="w-full space-y-4">
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                Invite link generated successfully.
              </div>

              <input
                value={inviteLink}
                className="w-full rounded-xl border border-input bg-muted/50 p-3 text-sm text-card-foreground outline-none"
              />

              <button
                type="button"
                onClick={copyLink}
                className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-sm transition hover:opacity-90"
              >
                Copy Invite Link
              </button>
            </div>
          )}
        </ModalFooter>
      </form>
    </Modal>
  );
}