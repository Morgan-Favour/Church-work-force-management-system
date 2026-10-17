
import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { UserRole } from "@prisma/client";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Mail,
  MapPin,
  Phone,
  UserRound,
  Users,
  BriefcaseBusiness,
  MessageCircle,
  Building2,
} from "lucide-react";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type MemberProfilePageProps = {
  params: Promise<{ id: string }>;
};

export default async function MemberProfilePage({
  params,
}: MemberProfilePageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== UserRole.ADMIN) {
    redirect("/dashboard");
  }

  const { id } = await params;

  const member = await prisma.member.findUnique({
    where: { id },
    include: {
      department: {
        select: { id: true, name: true },
      },
      g12: {
        select: { id: true, name: true },
      },
    },
  });

  if (!member) {
    notFound();
  }

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);

  const initials = member.fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="space-y-6">
      {/* Back navigation */}
      <Link
        href="/members"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft size={17} />
        Back to members
      </Link>

      {/* Profile header */}
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-xl font-bold text-primary sm:size-20 sm:text-2xl">
              {initials || <UserRound size={28} />}
            </div>

            <div className="min-w-0 space-y-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {member.fullName}
              </h1>

              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${member.isActive
                      ? "bg-primary/15 text-foreground"
                      : "bg-muted text-muted-foreground"
                    }`}
                >
                  {member.isActive ? "Active member" : "Inactive member"}
                </span>

                {member.department && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    <Building2 size={13} />
                    {member.department.name}
                  </span>
                )}
              </div>

              <p className="text-sm text-muted-foreground">
                Member since {formatDate(member.dateJoined)}
              </p>
            </div>
          </div>

          <Link
            href="/members"
            className="inline-flex items-center justify-center rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            All members
          </Link>
        </div>
      </section>

      {/* Contact information */}
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
            <Phone size={19} />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">
              Contact Information
            </h2>
            <p className="text-sm text-muted-foreground">
              How to reach this member
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem
            icon={<Phone size={17} />}
            label="Phone number"
            value={member.phone}
          />
          <InfoItem
            icon={<MessageCircle size={17} />}
            label="WhatsApp number"
            value={member.whatsappNo}
          />
          <InfoItem
            icon={<Mail size={17} />}
            label="Email address"
            value={member.email}
          />
          <InfoItem
            icon={<MapPin size={17} />}
            label="Residential address"
            value={member.address}
          />
        </div>
      </section>

      {/* Personal information */}
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
            <UserRound size={19} />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">
              Personal Information
            </h2>
            <p className="text-sm text-muted-foreground">
              Personal details recorded for this member
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem label="Gender" value={member.gender} />
          <InfoItem
            label="Date of birth"
            value={formatDate(member.dateOfBirth)}
          />
          <InfoItem label="Marital status" value={member.maritalStatus} />
          <InfoItem
            icon={<BriefcaseBusiness size={17} />}
            label="Occupation"
            value={member.occupation}
          />
        </div>
      </section>

      {/* Church information */}
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
            <Users size={19} />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">
              Church Information
            </h2>
            <p className="text-sm text-muted-foreground">
              Membership and group assignments
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem
            icon={<Building2 size={17} />}
            label="Department"
            value={member.department?.name}
          />
          <InfoItem
            icon={<Users size={17} />}
            label="G12 group"
            value={member.g12?.name}
          />
          <InfoItem
            icon={<CalendarDays size={17} />}
            label="Date joined"
            value={formatDate(member.dateJoined)}
          />
          <InfoItem
            icon={<CalendarDays size={17} />}
            label="Profile created"
            value={formatDate(member.createdAt)}
          />
        </div>
      </section>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="min-w-0 space-y-2">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <p className="text-sm">{label}</p>
      </div>

      <p className="break-words text-sm font-medium text-foreground">
        {value || "Not provided"}
      </p>
    </div>
  );
}
