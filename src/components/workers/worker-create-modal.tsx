"use client";

import { useState, useTransition } from "react";
import { createWorker } from "@/actions/worker.actions";

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

      setTimeout(() => {
        onClose();
      }, 1000);
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            Add Worker
          </h2>

          <button
            type="button"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

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
            <label className="block font-medium mb-2">
              Departments
            </label>

            <div className="grid grid-cols-2 gap-3 rounded-lg border p-4 max-h-64 overflow-y-auto">

              {departments.map((department) => (
                <label
                  key={department.id}
                  className="flex items-center gap-2"
                >
                  <input
                    type="checkbox"
                    name="departmentIds"
                    value={department.id}
                  />

                  {department.name}
                </label>
              ))}

            </div>
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

      </div>
    </div>
  );
}