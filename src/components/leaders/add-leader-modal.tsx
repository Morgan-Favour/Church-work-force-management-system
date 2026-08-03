"use client";

import React, { useState, useTransition } from "react";
import { createLeader } from "@/actions/leader.actions";
import { PasswordInput } from "../ui/password-ui";
import { ModalBody } from "../ui/modal-body";
import { ModalFooter } from "../ui/modal-footer";
import { ModalHeader } from "../ui/modal-header";
import Modal from "../ui/modal";

type Department = {
  id: string;
  name: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  departments: Department[];
};

export function AddLeaderModal({
  open,
  onClose,
  departments,
}: Props) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  if (!open) return null;

  function action(formData: FormData) {
    setMessage("");

    startTransition(async () => {
      const result = await createLeader(formData);

      if (result?.error) {
        setMessage(result.error);
        return;
      }

      setMessage(result?.success ?? "Leader created successfully.");
      onClose();
    });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
    >
      <ModalHeader
        title="Add Leader"
        description="Register a leader into one or more departments."
        onClose={onClose}
      />
      <ModalBody>
        <form action={action} className="space-y-5">

          <div>
            <label>Full Name</label>

            <input
              name="fullName"
              required
              className="mt-2 w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label>Phone</label>

            <input
              name="phone"
              required
              className="mt-2 w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label>Username</label>

            <input
              name="username"
              required
              className="mt-2 w-full rounded-lg border p-3"
            />
          </div>

          <PasswordInput
            name="password"
            label="Password"
            required
            minLength={8}
          />

          <div>
            <label>Department</label>

            <select
              name="departmentId"
              required
              className="mt-2 w-full rounded-lg border p-3"
            >
              <option value="">
                Select Department
              </option>

              {departments.map((department) => (
                <option
                  key={department.id}
                  value={department.id}
                >
                  {department.name}
                </option>
              ))}
            </select>
          </div>

          {message && (
            <div className="rounded-lg bg-slate-100 p-3">
              {message}
            </div>
          )}

          <button
            disabled={pending}
            className="w-full rounded-xl bg-[#0e2d33] py-3 text-white"
          >
            {pending ? "Saving..." : "Add Leader"}
          </button>

        </form>
      </ModalBody>
      <ModalFooter>
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-xl border py-3 font-semibold text-[#0e2d33]"
        >
          Cancel
        </button>
      </ModalFooter>
    </Modal>
  );
}
