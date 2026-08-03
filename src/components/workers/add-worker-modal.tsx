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
              <label className="block font-medium">
                Full Name
            </label>

            <input
              name="fullName"
              required
              className="mt-2 w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="block font-medium">
              Phone Number
            </label>

            <input
              name="phone"
              required
              className="mt-2 w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="block font-medium">
              Gender
            </label>

            <select
              name="gender"
              className="mt-2 w-full rounded-lg border p-3"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

            <div>
              <label>Department</label>

              <select
                name="departmentIds"
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
            className="w-full rounded-xl bg-[#0e2d33] py-3 font-semibold text-white"
          >
            {pending ? "Saving..." : "Add Worker"}
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
