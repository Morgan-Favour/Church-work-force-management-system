import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { PasswordInput } from "@/components/ui/password-ui";

async function createAdmin(formData: FormData) {
  "use server";

  const fullName = formData.get("fullName")?.toString().trim();
  const username = formData.get("username")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString();

  if (!fullName || !username || !password) {
    return;
  }

  if (password.length < 8) {
    return;
  }

  const adminCount = await prisma.user.count({
    where: {
      role: UserRole.ADMIN,
    },
  });

  if (adminCount > 0) {
    redirect("/login");
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (existingUser) {
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      fullName,
      username,
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
  });

  redirect("/login");
}

export default async function RegisterAdminPage() {
  const adminCount = await prisma.user.count({
    where: {
      role: UserRole.ADMIN,
    },
  });

  const userCount = await prisma.user.count();

  if (userCount > 0) {
    redirect("/login");
  }

  if (adminCount > 0) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <section className="w-full max-w-md rounded-3xl bg-card p-8 border border-border shadow-2xl shadow-black/5">
        <div className="mb-8 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <ShieldCheck className="text-primary" size={26} />
          </div>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-card-foreground">
            Create Admin
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Initial setup for GIC Egbelu Workforce.
          </p>
        </div>

        <form action={createAdmin} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-card-foreground">
              Full Name
            </label>
            <input
              name="fullName"
              required
              className="block w-full rounded-xl border border-input bg-card px-4 py-3 text-card-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
              placeholder="Admin name"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-card-foreground">
              Username
            </label>
            <input
              name="username"
              type="text"
              required
              className="block w-full rounded-xl border border-input bg-card px-4 py-3 text-card-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
              placeholder="admin@gic.org"
            />
          </div>

          <div>
            <PasswordInput
              name="password"
              label="Password"
              required
              minLength={8}
              placeholder="Minimum 8 characters"
              autoComplete="new-password"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Password must be at least 8 characters.
            </p>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-primary py-3 font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Create Admin Account
          </button>
          <p className="mt-4 text-sm text-muted-foreground">
            Already have an account? <a href="/login" className="text-primary hover:underline">Login</a>
          </p>
        </form>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          This page is disabled automatically after the first admin is created.
        </p>
      </section>
    </main>
  );
}