"use client";

import MemberForm, {
  type MemberOption,
} from "@/components/members/member-form";
import { submitPublicRegistration } from "@/actions/public-registration-actions";

type PublicRegistrationFormProps = {
  token: string;
  departments: MemberOption[];
  g12Groups: MemberOption[];
};

export default function PublicRegistrationForm({
  token,
  departments,
  g12Groups,
}: PublicRegistrationFormProps) {
  return (
    <MemberForm
      departments={departments}
      g12Groups={g12Groups}
      submitLabel="Submit Registration"
      submittingLabel="Submitting Registration..."
      onSubmit={(formData) =>
        submitPublicRegistration(token, {}, formData)
      }
    />
  );
}