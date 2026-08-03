"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ChevronDown } from "lucide-react";

type Department = {
  id: string;
  name: string;
};

type Props = {
  departments: Department[];
  name?: string;
  selected?: string[];
  multiple?: boolean;
};


export default function DepartmentCheckboxDropdown({
  departments,
  name = "departmentIds",
  selected = [],
  multiple = true,
}: Props) {
  const [open, setOpen] = useState(false);

  const [selectedDepartments, setSelectedDepartments] =
    useState<string[]>(selected);

  function toggleDepartment(id: string) {
    if (!multiple) {
      setSelectedDepartments([id]);
      setOpen(false);
      return;
    }

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

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  return (
    <div ref={dropdownRef} className="relative"
    >

      {/* Hidden inputs that are ALWAYS submitted */}
      {selectedDepartments.map((id) => (
        <input
          key={id}
          type="hidden"
          name={name}
          value={id}
        />
      ))}

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
            <div
              key={department.id}
              onClick={() => toggleDepartment(department.id)}
              className={`flex cursor-pointer items-center gap-3 rounded-lg p-3 transition
    ${selectedDepartments.includes(department.id)
                  ? "border border-[#0e2d33]/20 bg-[#0e2d33]/10"
                  : "hover:bg-slate-100"
                }`}
            >
              {multiple ? (
                <input
                  type="checkbox"
                  checked={selectedDepartments.includes(department.id)}
                  onChange={() => { }}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full border
        ${selectedDepartments.includes(department.id)
                      ? "border-[#0e2d33]"
                      : "border-slate-300"
                    }`}
                >
                  {selectedDepartments.includes(department.id) && (
                    <div className="h-2.5 w-2.5 rounded-full bg-[#0e2d33]" />
                  )}
                </div>
              )}

              <span className="flex-1">{department.name}</span>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}