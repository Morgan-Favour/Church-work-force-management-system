"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UserPlus } from "lucide-react";
import MemberForm, {
  type MemberOption,
} from "@/components/members/member-form";
import { createMember } from "@/actions/member.actions";

type AdminMemberRegistrationProps = {
  departments: MemberOption[];
  g12Groups: MemberOption[];
};

export default function AdminMemberRegistration({
  departments,
  g12Groups,
}: AdminMemberRegistrationProps) {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-10">
      <div>
        <Link
          href="/members"
          className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft size={16} />
          Back to members
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <UserPlus size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-card-foreground">
              Add New Member
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Register a member of GIC Egbelu Church.
            </p>
          </div>
        </div>
      </div>

      <MemberForm
        departments={departments}
        g12Groups={g12Groups}
        submitLabel="Add Member"
        submittingLabel="Saving Member..."
        onSubmit={createMember}
        onSuccess={() => {
          router.push("/members");
          router.refresh();
        }}
      />
    </div>
  );
}