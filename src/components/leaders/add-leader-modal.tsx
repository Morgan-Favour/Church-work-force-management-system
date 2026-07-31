"use client";

import React, { useState, useTransition } from "react";
import { createLeader } from "@/actions/leader.actions";
import { PasswordInput } from "../ui/password-ui";

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
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            Add Leader
          </h2>

          <button onClick={onClose}>
            ✕
          </button>
        </div>

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

      </div>
    </div>
  );
}