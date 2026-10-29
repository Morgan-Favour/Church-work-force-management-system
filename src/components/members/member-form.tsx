"use client";

import { useState, useTransition } from "react";
import { getAllStates, getLocalGovernments } from "@eh1z/nigerian-locations";

export type MemberField =
  | "fullName"
  | "gender"
  | "phone"
  | "whatsappNo"
  | "email"
  | "dateOfBirth"
  | "maritalStatus"
  | "occupation"
  | "address"
  | "stateOfOrigin"
  | "lga"
  | "dateJoined"
  | "departmentId"
  | "g12Id";

export type MemberOption = {
  id: string;
  name: string;
};

export type MemberFormResult = {
  error?: string;
  success?: string;
  fieldErrors?: Partial<Record<MemberField, string>>;
};

type MemberValues = Record<MemberField, string>;

type MemberFormProps = {
  departments: MemberOption[];
  g12Groups: MemberOption[];
  submitLabel: string;
  submittingLabel: string;
  onSubmit: (formData: FormData) => Promise<MemberFormResult>;
  onSuccess?: () => void;
};

type FieldConfig = {
  name: MemberField;
  label: string;
  required?: boolean;
  kind?: "input" | "select" | "textarea";
  type?: "text" | "tel" | "email" | "date";
  placeholder?: string;
  autoComplete?: string;
  options?: { value: string; label: string }[];
  rows?: number;
};

const initialValues: MemberValues = {
  fullName: "",
  gender: "",
  phone: "",
  whatsappNo: "",
  email: "",
  dateOfBirth: "",
  maritalStatus: "",
  occupation: "",
  stateOfOrigin: "",
  lga: "",
  address: "",
  dateJoined: "",
  departmentId: "",
  g12Id: "",
};

const inputClass =
  "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-visible:ring-destructive";

const labelClass = "mb-2 block text-sm font-semibold text-card-foreground";

const sections: { title: string; fields: FieldConfig[] }[] = [
  {
    title: "Personal Information",
    fields: [
      {
        name: "fullName",
        label: "Full Name",
        required: true,
        placeholder: "Enter full name",
        autoComplete: "name",
      },
      {
        name: "gender",
        label: "Gender",
        required: true,
        kind: "select",
        options: [
          { value: "Male", label: "Male" },
          { value: "Female", label: "Female" },
        ],
      },
      {
        name: "dateOfBirth",
        label: "Date of Birth",
        required: true,
        type: "date",
      },
      {
        name: "maritalStatus",
        label: "Marital Status",
        required: true,
        kind: "select",
        options: [
          { value: "Single", label: "Single" },
          { value: "Married", label: "Married" },
          { value: "Divorced", label: "Divorced" },
          { value: "Widowed", label: "Widowed" },
        ],
      },
      {
        name: "occupation",
        label: "Occupation",
        required: true,
        placeholder: "e.g. Teacher, Student, Trader",
      },
      {
        name: "address",
        label: "Residential Address",
        required: true,
        kind: "textarea",
        rows: 3,
        placeholder: "Enter residential address",
        autoComplete: "street-address",
      },
      {
        name: "stateOfOrigin",
        label: "State of Origin",
        required: true,
        kind: "select",
      },
      {
        name: "lga",
        label: "Local Government Area (LGA)",
        required: true,
        kind: "select",
      },
    ],
  },
  {
    title: "Contact Information",
    fields: [
      {
        name: "phone",
        label: "Phone Number",
        required: true,
        type: "tel",
        placeholder: "08012345678 or +2348144543193",
        autoComplete: "tel",
      },
      {
        name: "whatsappNo",
        label: "WhatsApp Number",
        type: "tel",
        placeholder: "Optional",
      },
      {
        name: "email",
        label: "Email Address",
        type: "email",
        placeholder: "Optional",
        autoComplete: "email",
      },
    ],
  },
  {
    title: "Church Information",
    fields: [
      {
        name: "dateJoined",
        label: "Date Joined Church",
        required: true,
        type: "date",
      },
      {
        name: "departmentId",
        label: "Department",
        kind: "select",
      },
      {
        name: "g12Id",
        label: "G12 Group",
        kind: "select",
      },
    ],
  },
];

function getLocalToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function isValidPhone(value: string) {
  return /^\+?\d{11,15}$/.test(value.trim());
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function validate(values: MemberValues): Partial<Record<MemberField, string>> {
  const errors: Partial<Record<MemberField, string>> = {};
  const today = getLocalToday();

  if (!values.fullName.trim()) {
    errors.fullName = "Please enter the full name.";
  }

  if (!values.gender) {
    errors.gender = "Please select a gender.";
  }

  if (!values.phone.trim()) {
    errors.phone = "Please enter a phone number.";
  } else if (!isValidPhone(values.phone.trim())) {
    errors.phone = "Enter 11–15 digits, optionally preceded by +.";
  }

  if (values.whatsappNo.trim() && !isValidPhone(values.whatsappNo.trim())) {
    errors.whatsappNo = "Enter 11–15 digits, optionally preceded by +.";
  }

  if (values.email.trim() && !isValidEmail(values.email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!values.dateOfBirth) {
    errors.dateOfBirth = "Please enter a date of birth.";
  } else if (values.dateOfBirth > today) {
    errors.dateOfBirth = "Date of birth cannot be in the future.";
  }

  if (!values.maritalStatus) {
    errors.maritalStatus = "Please select a marital status.";
  }

  if (!values.occupation.trim()) {
    errors.occupation = "Please enter an occupation.";
  }

  if (!values.stateOfOrigin) {
    errors.stateOfOrigin = "Please select a state of origin.";
  }

  if (!values.lga) {
    errors.lga = "Please select a local government area.";
  }

  if (!values.address.trim()) {
    errors.address = "Please enter a residential address.";
  }

  if (!values.dateJoined) {
    errors.dateJoined = "Please enter the date joined.";
  } else if (values.dateJoined > today) {
    errors.dateJoined = "Date joined cannot be in the future.";
  }

  return errors;
}

function FieldError({
  id,
  message,
}: {
  id: string;
  message?: string;
}) {
  if (!message) return null;

  return (
    <p id={id} className="mt-1.5 text-sm text-destructive" role="alert">
      {message}
    </p>
  );
}

export default function MemberForm({
  departments,
  g12Groups,
  submitLabel,
  submittingLabel,
  onSubmit,
  onSuccess,
}: MemberFormProps) {
  const [values, setValues] = useState<MemberValues>(initialValues);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<MemberField, string>>
  >({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();

  const states = getAllStates();

  const lgas = values.stateOfOrigin
    ? getLocalGovernments(values.stateOfOrigin)
    : [];

  function updateField(field: MemberField, value: string) {
    setValues((previous) => ({
      ...previous,
      [field]: value,
      ...(field === "stateOfOrigin" ? { lga: "" } : {}),
    }));

    setFieldErrors((previous) => {
      const next = { ...previous };
      delete next[field];

      if (field === "stateOfOrigin") {
        delete next.lga;
      }

      return next;
    });

    setError("");
    setSuccess("");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const errors = validate(values);

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);

      const firstInvalidField = Object.keys(errors)[0];
      document.getElementById(firstInvalidField)?.focus();
      return;
    }

    setFieldErrors({});

    const formData = new FormData();

    for (const [key, value] of Object.entries(values)) {
      formData.set(key, value);
    }

    startTransition(async () => {
      try {
        const result = await onSubmit(formData);

        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
          setError(result.error ?? "Please correct the highlighted fields.");

          const firstInvalidField = Object.keys(result.fieldErrors)[0];
          if (firstInvalidField) {
            document.getElementById(firstInvalidField)?.focus();
          }

          return;
        }

        if (result.error) {
          setError(result.error);
          return;
        }

        if (result.success) {
          if (onSuccess) {
            onSuccess();
          } else {
            setSuccess(result.success);
            setValues(initialValues);
          }
        }
      } catch (submissionError) {
        console.error("Member form submission error:", submissionError);
        setError("Something went wrong. Your entries have been preserved. Please try again.");
      }
    });
  }

  if (success) {
    return (
      <section
        className="rounded-2xl border border-border bg-card p-6 text-card-foreground"
        role="status"
      >
        <h2 className="text-xl font-bold">Registration complete</h2>
        <p className="mt-2 text-muted-foreground">{success}</p>
        <p className="mt-3 text-sm text-muted-foreground">
          Thank you for registering with GIC Egbelu Church.
        </p>
      </section>
    );
  }

  const today = getLocalToday();

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Fields marked with * are required. Optional fields can be left blank.
      </p>

      {sections.map((section) => (
        <section
          key={section.title}
          className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"
        >
          <h2 className="text-lg font-bold text-card-foreground">
            {section.title}
          </h2>

          <div className="grid gap-5 sm:grid-cols-2">
            {section.fields.map((field) => {
              const name = field.name;
              const fieldError = fieldErrors[name];
              const errorId = `${name}-error`;
              const isWide =
                name === "fullName" ||
                name === "address" ||
                name === "email";

              const commonProps = {
                id: name,
                name,
                value: values[name],
                onChange: (
                  event: React.ChangeEvent<
                    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
                  >
                ) => updateField(name, event.target.value),
                className: inputClass,
                "aria-invalid": Boolean(fieldError),
                "aria-describedby": fieldError ? errorId : undefined,
              };

              return (
                <div
                  key={name}
                  className={isWide ? "sm:col-span-2" : undefined}
                >
                  <label htmlFor={name} className={labelClass}>
                    {field.label}
                    {field.required ? " *" : ""}
                  </label>

                  {field.kind === "select" ? (
                    <select   {...commonProps}
                      required={field.required}
                      disabled={name === "lga" && !values.stateOfOrigin}>
                      <option value="">
                        {name === "departmentId"
                          ? "No department assigned"
                          : name === "g12Id"
                            ? "No G12 group assigned"
                            : `Select ${field.label.toLowerCase()}`}
                      </option>
                      {name === "stateOfOrigin" &&
                        states.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}

                      {name === "lga" &&
                        lgas.map((lga) => (
                          <option key={lga} value={lga}>
                            {lga}
                          </option>
                        ))}
                      {name === "departmentId" &&
                        departments.map((department) => (
                          <option key={department.id} value={department.id}>
                            {department.name}
                          </option>
                        ))}

                      {name === "g12Id" &&
                        g12Groups.map((group) => (
                          <option key={group.id} value={group.id}>
                            {group.name}
                          </option>
                        ))}

                      {field.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : field.kind === "textarea" ? (
                    <textarea
                      {...commonProps}
                      rows={field.rows ?? 3}
                      placeholder={field.placeholder}
                      autoComplete={field.autoComplete}
                      className={`${inputClass} resize-y`}
                    />
                  ) : (
                    <input
                      {...commonProps}
                      type={field.type ?? "text"}
                      placeholder={field.placeholder}
                      autoComplete={field.autoComplete}
                      inputMode={field.type === "tel" ? "tel" : undefined}
                      max={
                        field.type === "date" &&
                          (name === "dateOfBirth" || name === "dateJoined")
                          ? today
                          : undefined
                      }
                    />
                  )}

                  <FieldError id={errorId} message={fieldError} />
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm font-medium text-destructive"
        >
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {isPending ? submittingLabel : submitLabel}
        </button>
      </div>
    </form>
  );
}