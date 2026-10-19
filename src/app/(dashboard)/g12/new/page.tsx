
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { UserRole } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import G12Form from "@/components/g12/g12-form";
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";

export default async function NewG12Page() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== UserRole.ADMIN) {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <Link
        href="/g12"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to G12 Directory
      </Link>

      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Users className="h-5 w-5" />
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">
            Add New G12
          </h1>
          <p className="text-sm text-muted-foreground">
            Create a G12 group and provide its host, leader, and contact information.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 text-card-foreground sm:p-6">
        <G12Form />
      </div>
    </div>
  );
}
