"use client";

import { useEffect, useRef, useState } from "react";

type Department = {
  id: string;
  name: string;
};

type Props = {
  departments: Department[];
  defaultSelectedIds?: string[];
};

export function DepartmentCheckboxDropdown({
  departments,
  defaultSelectedIds = [],
}: Props) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState(defaultSelectedIds);

  const selectedDepartments = departments.filter((department) =>
    selectedIds.includes(department.id)
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function toggleDepartment(id: string) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  return (
    <div ref={dropdownRef} className="relative">
      {selectedIds.map((id) => (
        <input key={id} type="hidden" name="departmentIds" value={id} />
      ))}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between rounded-xl border border-slate-300 bg-white px-4 py-3 text-left text-sm text-slate-700 outline-none transition hover:bg-slate-50 focus:border-[#0e2d33] focus:ring-4 focus:ring-[#0e2d33]/10"
      >
        <span>
          {selectedDepartments.length === 0
            ? "Select departments"
            : selectedDepartments.map((item) => item.name).join(", ")}
        </span>

        <span className="text-slate-400">{open ? "⌃" : "⌄"}</span>
      </button>

      {open && (
        <div className="absolute z-30 mt-2 max-h-64 w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
          {departments.map((department) => {
            const checked = selectedIds.includes(department.id);

            return (
              <button
                key={department.id}
                type="button"
                onClick={() => toggleDepartment(department.id)}
                className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
              >
                <span
                  className={
                    checked
                      ? "flex h-4 w-4 items-center justify-center rounded border border-[#0e2d33] bg-[#0e2d33] text-[10px] text-white"
                      : "h-4 w-4 rounded border border-slate-300 bg-white"
                  }
                >
                  {checked ? "✓" : ""}
                </span>

                <span>{department.name}</span>
              </button>
            );
          })}
        </div>
      )}

      {selectedDepartments.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedDepartments.map((department) => (
            <span
              key={department.id}
              className="rounded-full bg-[#0e2d33]/10 px-3 py-1 text-xs font-semibold text-[#0e2d33]"
            >
              {department.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}