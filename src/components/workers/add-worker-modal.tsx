"use client";

import { useState, useTransition } from "react";
import { createWorker } from "@/actions/worker.actions";
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



export function WorkerCreateModal({
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
      const result = await createWorker(formData);

      if (result?.error) {
        setMessage(result.error);
        return;
      }

      setMessage(result?.success ?? "Worker created successfully.");
      onClose();

    });
  }

  return (
    <Modal open={open} onClose={onClose} size="lg">
      <ModalHeader
        title="Add Worker"
        description="Register a worker into one or more departments."
        onClose={onClose}
      />
      <ModalBody>
        <form action={action} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-card-foreground">
              Full Name
            </label>

            <input
              name="fullName"
              required
              placeholder="Enter worker full name"
              className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-card-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-card-foreground">
              Phone Number
            </label>

            <input
              name="phone"
              type="tel"
              required
              inputMode="numeric"
              placeholder="08012345678"
              className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-card-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-card-foreground">
              Gender
            </label>

            <select
              name="gender"
              defaultValue=""
              className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-card-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-card-foreground">
              Department
            </label>

            <select
              name="departmentIds"
              required
              defaultValue=""
              className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-card-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
            >
              <option value="" disabled>
                Select Department
              </option>

              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>

          {message && (
            <div className="rounded-xl border border-border bg-muted/50 p-3 text-sm text-card-foreground">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Saving..." : "Add Worker"}
          </button>
        </form>
      </ModalBody>
      <ModalFooter>
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-xl border border-border bg-card py-3 text-sm font-bold text-card-foreground transition hover:bg-muted/50"
        >
          Cancel
        </button>
      </ModalFooter>
    </Modal>
  );
}
