
"use client";

import { useActionState, useState } from "react";
import { submitPublicRegistration } from "@/actions/public-registration-actions";

type Option = {
  id: string;
  name: string;
};

type FieldName =
  | "fullName"
  | "gender"
  | "phone"
  | "whatsappNo"
  | "email"
  | "dateOfBirth"
  | "maritalStatus"
  | "occupation"
  | "address"
  | "dateJoined"
  | "departmentId"
  | "g12Id";

type RegistrationValues = Record<FieldName, string>;

type RegistrationResult = {
  error?: string;
  success?: string;
  fieldErrors?: Partial<Record<FieldName, string>>;
};

type PublicRegistrationFormProps = {
  token: string;
  departments: Option[];
  g12Groups: Option[];
};

const initialValues: RegistrationValues = {
  fullName: "",
  gender: "",
  phone: "",
  whatsappNo: "",
  email: "",
  dateOfBirth: "",
  maritalStatus: "",
  occupation: "",
  address: "",
  dateJoined: "",
  departmentId: "",
  g12Id: "",
};

const inputClass =
  "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-visible:ring-destructive";

const labelClass =
  "mb-2 block text-sm font-semibold text-card-foreground";

function FieldError({ message, id }: { message?: string; id: string }) {
  if (!message) return null;

  return (
    <p id={id} className="mt-1.5 text-sm text-destructive" role="alert">
      {message}
    </p>
  );
}

function isValidPhone(value: string) {
  return /^\d{11,15}$/.test(value);
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validate(values: RegistrationValues) {
  const errors: Partial<Record<FieldName, string>> = {};

  if (!values.fullName.trim()) {
    errors.fullName = "Please enter your full name.";
  }

  if (!values.gender) {
    errors.gender = "Please select your gender.";
  }

  if (!values.phone.trim()) {
    errors.phone = "Please enter your phone number.";
  } else if (!isValidPhone(values.phone.trim())) {
    errors.phone = "Enter 11–15 digits without spaces or symbols.";
  }

  if (
    values.whatsappNo.trim() &&
    !isValidPhone(values.whatsappNo.trim())
  ) {
    errors.whatsappNo = "Enter 11–15 digits without spaces or symbols.";
  }

  if (values.email.trim() && !isValidEmail(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  if (!values.dateOfBirth) {
    errors.dateOfBirth = "Please enter your date of birth.";
  } else if (values.dateOfBirth > new Date().toLocaleDateString("en-CA")) {
    errors.dateOfBirth = "Date of birth cannot be in the future.";
  }

  if (!values.maritalStatus) {
    errors.maritalStatus = "Please select your marital status.";
  }

  if (!values.occupation.trim()) {
    errors.occupation = "Please enter your occupation.";
  }

  if (!values.address.trim()) {
    errors.address = "Please enter your residential address.";
  }

  if (!values.dateJoined) {
    errors.dateJoined = "Please enter the date you joined the church.";
  } else if (values.dateJoined > new Date().toLocaleDateString("en-CA")) {
    errors.dateJoined = "Date joined cannot be in the future.";
  }

  return errors;
}

export default function PublicRegistrationForm({
  token,
  departments,
  g12Groups,
}: PublicRegistrationFormProps) {
  const [values, setValues] = useState<RegistrationValues>(initialValues);
  const [clientErrors, setClientErrors] = useState<
    Partial<Record<FieldName, string>>
  >({});
  const [submitted, setSubmitted] = useState(false);

  const actionWithToken = submitPublicRegistration.bind(null, token);

  const [state, formAction, isPending] = useActionState<
    RegistrationResult,
    FormData
  >(actionWithToken, {});

  const fieldErrors = { ...state.fieldErrors, ...clientErrors };

  function updateField(field: FieldName, value: string) {
    setValues((previous) => ({ ...previous, [field]: value }));

    setClientErrors((previous) => {
      const next = { ...previous };
      delete next[field];
      return next;
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const errors = validate(values);

    if (Object.keys(errors).length > 0) {
      event.preventDefault();
      setClientErrors(errors);
      setSubmitted(true);

      const firstInvalidField = Object.keys(errors)[0];
      document.getElementById(firstInvalidField)?.focus();
      return;
    }

    setClientErrors({});
    setSubmitted(true);
  }

  if (state.success) {
    return (
      <section
        className="rounded-2xl border border-border bg-card p-6 text-card-foreground"
        role="status"
      >
        <h2 className="text-xl font-bold">Registration complete</h2>
        <p className="mt-2 text-muted-foreground">{state.success}</p>
        <p className="mt-3 text-sm text-muted-foreground">
          Thank you for registering with GIC Egbelu Church.
        </p>
      </section>
    );
  }

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      noValidate
      className="space-y-6"
    >
      {(state.error || (submitted && Object.keys(fieldErrors).length > 0)) && (
        <div
          className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"
          role="alert"
        >
          {state.error || "Please correct the highlighted fields below."}
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        Fields marked with * are required. Optional fields can be left blank.
      </p>

      <section className="space-y-4">
        <h2 className="text-lg font-bold">Personal information</h2>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="fullName">
              Full name *
            </label>
            <input
              id="fullName"
              name="fullName"
              value={values.fullName}
              onChange={(e) => updateField("fullName", e.target.value)}
              autoComplete="name"
              className={inputClass}
              placeholder="Enter your full name"
              aria-invalid={Boolean(fieldErrors.fullName)}
              aria-describedby={fieldErrors.fullName ? "fullName-error" : undefined}
            />
            <FieldError id="fullName-error" message={fieldErrors.fullName} />
          </div>

          <div>
            <label className={labelClass} htmlFor="gender">
              Gender *
            </label>
            <select
              id="gender"
              name="gender"
              value={values.gender}
              onChange={(e) => updateField("gender", e.target.value)}
              className={inputClass}
              aria-invalid={Boolean(fieldErrors.gender)}
              aria-describedby={fieldErrors.gender ? "gender-error" : undefined}
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <FieldError id="gender-error" message={fieldErrors.gender} />
          </div>

          <div>
            <label className={labelClass} htmlFor="dateOfBirth">
              Date of birth *
            </label>
            <input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={values.dateOfBirth}
              max={new Date().toLocaleDateString("en-CA")}
              onChange={(e) => updateField("dateOfBirth", e.target.value)}
              className={inputClass}
              aria-invalid={Boolean(fieldErrors.dateOfBirth)}
              aria-describedby={
                fieldErrors.dateOfBirth ? "dateOfBirth-error" : undefined
              }
            />
            <FieldError
              id="dateOfBirth-error"
              message={fieldErrors.dateOfBirth}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="maritalStatus">
              Marital status *
            </label>
            <select
              id="maritalStatus"
              name="maritalStatus"
              value={values.maritalStatus}
              onChange={(e) => updateField("maritalStatus", e.target.value)}
              className={inputClass}
              aria-invalid={Boolean(fieldErrors.maritalStatus)}
              aria-describedby={
                fieldErrors.maritalStatus ? "maritalStatus-error" : undefined
              }
            >
              <option value="">Select marital status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
            <FieldError
              id="maritalStatus-error"
              message={fieldErrors.maritalStatus}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="occupation">
              Occupation *
            </label>
            <input
              id="occupation"
              name="occupation"
              value={values.occupation}
              onChange={(e) => updateField("occupation", e.target.value)}
              className={inputClass}
              placeholder="e.g. Teacher, student, trader"
              aria-invalid={Boolean(fieldErrors.occupation)}
              aria-describedby={
                fieldErrors.occupation ? "occupation-error" : undefined
              }
            />
            <FieldError
              id="occupation-error"
              message={fieldErrors.occupation}
            />
          </div>

          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="address">
              Residential address *
            </label>
            <textarea
              id="address"
              name="address"
              rows={3}
              value={values.address}
              onChange={(e) => updateField("address", e.target.value)}
              autoComplete="street-address"
              className={`${inputClass} resize-y`}
              placeholder="Enter your residential address"
              aria-invalid={Boolean(fieldErrors.address)}
              aria-describedby={fieldErrors.address ? "address-error" : undefined}
            />
            <FieldError id="address-error" message={fieldErrors.address} />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold">Contact information</h2>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="phone">
              Phone number *
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              // inputMode="numeric"
              autoComplete="tel"
              value={values.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              className={inputClass}
              placeholder="e.g. 08012345678"
              aria-invalid={Boolean(fieldErrors.phone)}
              aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
            />
            <FieldError id="phone-error" message={fieldErrors.phone} />
          </div>

          <div>
            <label className={labelClass} htmlFor="whatsappNo">
              WhatsApp number
            </label>
            <input
              id="whatsappNo"
              name="whatsappNo"
              type="tel"
              inputMode="numeric"
              value={values.whatsappNo}
              onChange={(e) => updateField("whatsappNo", e.target.value)}
              className={inputClass}
              placeholder="Optional"
              aria-invalid={Boolean(fieldErrors.whatsappNo)}
              aria-describedby={
                fieldErrors.whatsappNo ? "whatsappNo-error" : undefined
              }
            />
            <FieldError
              id="whatsappNo-error"
              message={fieldErrors.whatsappNo}
            />
          </div>

          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={(e) => updateField("email", e.target.value)}
              className={inputClass}
              placeholder="Optional"
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
            />
            <FieldError id="email-error" message={fieldErrors.email} />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold">Church information</h2>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="dateJoined">
              Date joined church *
            </label>
            <input
              id="dateJoined"
              name="dateJoined"
              type="date"
              max={new Date().toLocaleDateString("en-CA")}
              value={values.dateJoined}
              onChange={(e) => updateField("dateJoined", e.target.value)}
              className={inputClass}
              aria-invalid={Boolean(fieldErrors.dateJoined)}
              aria-describedby={
                fieldErrors.dateJoined ? "dateJoined-error" : undefined
              }
            />
            <FieldError
              id="dateJoined-error"
              message={fieldErrors.dateJoined}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="departmentId">
              Department
            </label>
            <select
              id="departmentId"
              name="departmentId"
              value={values.departmentId}
              onChange={(e) => updateField("departmentId", e.target.value)}
              className={inputClass}
              aria-invalid={Boolean(fieldErrors.departmentId)}
              aria-describedby={
                fieldErrors.departmentId ? "departmentId-error" : undefined
              }
            >
              <option value="">No department assigned</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
            <FieldError
              id="departmentId-error"
              message={fieldErrors.departmentId}
            />
          </div>

          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="g12Id">
              G12 group
            </label>
            <select
              id="g12Id"
              name="g12Id"
              value={values.g12Id}
              onChange={(e) => updateField("g12Id", e.target.value)}
              className={inputClass}
              aria-invalid={Boolean(fieldErrors.g12Id)}
              aria-describedby={fieldErrors.g12Id ? "g12Id-error" : undefined}
            >
              <option value="">No G12 group assigned</option>
              {g12Groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
            <FieldError id="g12Id-error" message={fieldErrors.g12Id} />
          </div>
        </div>
      </section>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-primary px-5 py-3 font-bold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Submitting registration..." : "Submit registration"}
      </button>
    </form>
  );
}
