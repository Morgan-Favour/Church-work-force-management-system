
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save, Users, LoaderCircle } from "lucide-react";
import {
  createG12,
  updateG12,
  type G12ActionResult,
} from "@/actions/g12.actions";

type G12InitialValues = {
  id?: string;
  name?: string;
  hostLocation?: string | null;
  hostName?: string | null;
  leaderName?: string | null;
  contactPhone?: string | null;
  contactWhatsApp?: string | null;
  contactEmail?: string | null;
  contactPerson?: string | null;
};

type G12FormProps = {
  initialValues?: G12InitialValues;
};

export default function G12Form({ initialValues }: G12FormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<G12ActionResult>({});

  const isEditing = Boolean(initialValues?.id);

  async function handleSubmit(formData: FormData) {
    setResult({});

    startTransition(async () => {
      const response = initialValues?.id
        ? await updateG12(initialValues.id, formData)
        : await createG12(formData);

      setResult(response);

      if (response.success) {
        if (isEditing && initialValues?.id) {
          router.push(`/g12/${initialValues.id}`);
        } else {
          router.push("/g12");
        }

        router.refresh();
      }
    });
  }

  const fieldClass =
    "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-ring";

  const labelClass = "mb-1.5 block text-sm font-medium";
  const errorClass = "mt-1 text-sm text-destructive";

  function fieldError(field: keyof NonNullable<G12ActionResult["fieldErrors"]>) {
    return result.fieldErrors?.[field];
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {result.error && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
        >
          {result.error}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            G12 Name *
          </label>
          <input
            id="name"
            name="name"
            required
            defaultValue={initialValues?.name ?? ""}
            className={fieldClass}
            placeholder="Enter G12 name"
            aria-invalid={Boolean(fieldError("name"))}
          />
          {fieldError("name") && (
            <p className={errorClass}>{fieldError("name")}</p>
          )}
        </div>

        <div>
          <label htmlFor="hostLocation" className={labelClass}>
            Host Location *
          </label>
          <input
            id="hostLocation"
            name="hostLocation"
            required
            defaultValue={initialValues?.hostLocation ?? ""}
            className={fieldClass}
            placeholder="Enter host location"
            aria-invalid={Boolean(fieldError("hostLocation"))}
          />
          {fieldError("hostLocation") && (
            <p className={errorClass}>{fieldError("hostLocation")}</p>
          )}
        </div>

        <div>
          <label htmlFor="hostName" className={labelClass}>
            Host Name *
          </label>
          <input
            id="hostName"
            name="hostName"
            required
            defaultValue={initialValues?.hostName ?? ""}
            className={fieldClass}
            placeholder="Enter host's name"
            aria-invalid={Boolean(fieldError("hostName"))}
          />
          {fieldError("hostName") && (
            <p className={errorClass}>{fieldError("hostName")}</p>
          )}
        </div>

        <div>
          <label htmlFor="leaderName" className={labelClass}>
            G12 Leader *
          </label>
          <input
            id="leaderName"
            name="leaderName"
            required
            defaultValue={initialValues?.leaderName ?? ""}
            className={fieldClass}
            placeholder="Enter G12 leader's name"
            aria-invalid={Boolean(fieldError("leaderName"))}
          />
          {fieldError("leaderName") && (
            <p className={errorClass}>{fieldError("leaderName")}</p>
          )}
        </div>

        <div>
          <label htmlFor="contactPerson" className={labelClass}>
            Contact Person *
          </label>
          <select
            id="contactPerson"
            name="contactPerson"
            required
            defaultValue={initialValues?.contactPerson ?? "LEADER"}
            className={fieldClass}
          >
            <option value="LEADER">G12 Leader</option>
            <option value="HOST">Host</option>
          </select>
          {fieldError("contactPerson") && (
            <p className={errorClass}>{fieldError("contactPerson")}</p>
          )}
        </div>

        <div>
          <label htmlFor="contactPhone" className={labelClass}>
            Contact Phone *
          </label>
          <input
            id="contactPhone"
            name="contactPhone"
            type="tel"
            required
            defaultValue={initialValues?.contactPhone ?? ""}
            className={fieldClass}
            placeholder="e.g. +2348012345678"
            aria-invalid={Boolean(fieldError("contactPhone"))}
          />
          {fieldError("contactPhone") && (
            <p className={errorClass}>{fieldError("contactPhone")}</p>
          )}
        </div>

        <div>
          <label htmlFor="contactWhatsApp" className={labelClass}>
            WhatsApp Number
          </label>
          <input
            id="contactWhatsApp"
            name="contactWhatsApp"
            type="tel"
            defaultValue={initialValues?.contactWhatsApp ?? ""}
            className={fieldClass}
            placeholder="Optional WhatsApp number"
            aria-invalid={Boolean(fieldError("contactWhatsApp"))}
          />
          {fieldError("contactWhatsApp") && (
            <p className={errorClass}>{fieldError("contactWhatsApp")}</p>
          )}
        </div>

        <div>
          <label htmlFor="contactEmail" className={labelClass}>
            Contact Email
          </label>
          <input
            id="contactEmail"
            name="contactEmail"
            type="email"
            defaultValue={initialValues?.contactEmail ?? ""}
            className={fieldClass}
            placeholder="Optional email address"
            aria-invalid={Boolean(fieldError("contactEmail"))}
          />
          {fieldError("contactEmail") && (
            <p className={errorClass}>{fieldError("contactEmail")}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          disabled={isPending}
          onClick={() => router.back()}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isPending
            ? "Saving..."
            : isEditing
              ? "Save Changes"
              : "Create G12"}
        </button>
      </div>
    </form>
  );
}
