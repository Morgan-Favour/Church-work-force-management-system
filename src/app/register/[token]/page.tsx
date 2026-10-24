
import { prisma } from "@/lib/prisma";
import PublicRegistrationForm from "@/components/members/public-registration-form";
import Image from "next/image";

export const dynamic = "force-dynamic";

type RegistrationPageProps = {
  params: Promise<{ token: string }>;
};

export default async function PublicRegistrationPage({
  params,
}: RegistrationPageProps) {
  const { token } = await params;

  const activeLink = await prisma.memberRegistrationLink.findFirst({
    where: {
      token,
      isActive: true,
    },
    select: { id: true },
  });

  if (!activeLink) {
    return (
      <main className="min-h-screen bg-background px-4 py-10 text-foreground sm:py-16">
        <div className="mx-auto max-w-xl rounded-xl border border-border bg-card p-6 text-card-foreground sm:p-8">
          <h1 className="text-2xl font-semibold">
            Registration link unavailable
          </h1>
          <p className="mt-3 text-muted-foreground">
            This registration link is invalid or no longer active. Please
            contact GIC Egbelu Church to request the current registration link.
          </p>
        </div>
      </main>
    );
  }

  const [departments, g12Groups] = await Promise.all([
    prisma.department.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.g12.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground sm:py-16">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 text-center">
          <Image
            src="/logo.png"
            alt="GIC Egbelu Church Logo"
            width={100}
            height={100}
            className="mx-auto bg-accent-foreground rounded-2xl p-2"
          />
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Membership Registration
          </h1> 
        </header>

        <div className="rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm sm:p-8">
          <PublicRegistrationForm
            token={token}
            departments={departments}
            g12Groups={g12Groups}
          />
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          GIC Egbelu Church Management System
        </p>
      </div>
    </main>
  );
}
