"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

type Department = {
  id: string;
  name: string;
};

type Props = {
  departments: Department[];
  name?: string;
  selected?: string[];
};

export const DepartmentCheckboxDropdown = ({
  departments,
  name = "departmentIds",
  selected = [],
}: Props) => {
  const [open, setOpen] = useState(false);

  const [selectedDepartments, setSelectedDepartments] =
    useState<string[]>(selected);

  function toggleDepartment(id: string) {
    setSelectedDepartments((current) =>
      current.includes(id)
        ? current.filter((d) => d !== id)
        : [...current, id]
    );
  }

  const selectedNames = useMemo(() => {
    return departments
      .filter((d) => selectedDepartments.includes(d.id))
      .map((d) => d.name)
      .join(", ");
  }, [departments, selectedDepartments]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-xl border border-slate-300 bg-white px-4 py-3 text-left"
      >
        <span className="truncate text-sm">
          {selectedDepartments.length
            ? selectedNames
            : "Select department(s)"}
        </span>

        <ChevronDown size={18} />
      </button>

      {open && (
        <div className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border bg-white p-3 shadow-xl">
          {departments.map((department) => (
            <label
              key={department.id}
              className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-slate-100"
            >
              <input
                type="checkbox"
                name={name}
                value={department.id}
                checked={selectedDepartments.includes(department.id)}
                onChange={() => toggleDepartment(department.id)}
              />

              <span>{department.name}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}