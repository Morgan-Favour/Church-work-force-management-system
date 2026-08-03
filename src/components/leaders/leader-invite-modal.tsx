"use client";

import { useState, useTransition } from "react";
import { createLeaderInvite } from "@/actions/leader.actions";
import DepartmentCheckboxDropdown from "../workers/department-checkbox-dropdown";
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

export function LeaderInviteModal({
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

  function handleSubmit(formData: FormData) {
    setInviteLink("");
    setError("");

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

  async function copyLink() {
    await navigator.clipboard.writeText(inviteLink);

    setTimeout(() => {
      closeModal();
    }, 500);
  }

  return (
    <Modal
      open={open}
      onClose={closeModal}
      size="lg"
    >
      <ModalHeader
        title="Invite Leader"
        description="Generate a secure registration link for one or more departments."
        onClose={closeModal}
      />

      <ModalBody>
        <form action={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Department(s)
            </label>

            <DepartmentCheckboxDropdown
              departments={departments}
              name="departmentIds"
              multiple={false}
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {!inviteLink ? (
            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-xl bg-[#0e2d33] py-3 font-semibold text-white transition hover:bg-[#123940] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? "Generating Invite..." : "Generate Invite Link"}
            </button>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                Invite link generated successfully.
              </div>

              <input
                readOnly
                value={inviteLink}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 p-3 text-sm"
              />
            </div>
          )}
        </form>
      </ModalBody>

      <ModalFooter>
        {!inviteLink ? (
          <button
            type="button"
            onClick={closeModal}
            className="w-full rounded-xl border border-slate-300 py-3 font-semibold text-[#0e2d33] hover:bg-slate-50"
          >
            Cancel
          </button>
        ) : (
          <button
            type="button"
            onClick={copyLink}
            className="w-full rounded-xl bg-[#0e2d33] py-3 font-semibold text-white hover:bg-[#123940]"
          >
            Copy Invite Link
          </button>
        )}
      </ModalFooter>
    </Modal>
  );
}