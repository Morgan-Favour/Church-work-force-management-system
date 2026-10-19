
import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { UserRole } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import G12Form from "@/components/g12/g12-form";
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";

type EditG12PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditG12Page({
  params,
}: EditG12PageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== UserRole.ADMIN) {
    redirect("/dashboard");
  }

  const { id } = await params;

  const group = await prisma.g12.findUnique({
    where: { id },
  });

  if (!group || !group.isActive) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <Link
        href={`/g12/${group.id}`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to G12 Details
      </Link>

      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Users className="h-5 w-5" />
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">
            Edit G12
          </h1>
          <p className="text-sm text-muted-foreground">
            Update the details for {group.name}.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 text-card-foreground sm:p-6">
        <G12Form
          initialValues={{
            id: group.id,
            name: group.name,
            hostLocation: group.hostLocation,
            hostName: group.hostName,
            leaderName: group.leaderName,
            contactPhone: group.contactPhone,
            contactWhatsApp: group.contactWhatsApp,
            contactEmail: group.contactEmail,
            contactPerson: group.contactPerson,
          }}
        />
      </div>
    </div>
  );
}
