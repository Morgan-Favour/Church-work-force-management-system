
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { UserRole } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import G12Directory from "@/components/g12/g12-directory";
import Link from "next/link";
import { Plus, Users } from "lucide-react";

export default async function G12Page() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== UserRole.ADMIN) {
    redirect("/dashboard");
  }

  const groups = await prisma.g12.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      hostLocation: true,
      hostName: true,
      leaderName: true,
      contactPhone: true,
      contactWhatsApp: true,
      contactEmail: true,
      contactPerson: true,
    },
  });

  return (
    <div className="mx-auto w-full space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Users className="h-5 w-5" />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">
              G12 Directory
            </h1>
            <p className="text-sm text-muted-foreground">
              View and manage the church&apos;s G12 groups.
            </p>
          </div>
        </div>

        <Link
          href="/g12/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Add G12
        </Link>
      </div>

      <G12Directory groups={groups} />
    </div>
  );
}
