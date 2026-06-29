import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";

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

  if (adminCount > 0) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl shadow-slate-200">
        <div className="mb-8 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0e2d33]/10">
            <ShieldCheck className="text-[#0e2d33]" size={26} />
          </div>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[#0e2d33]">
            Create Admin
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Initial setup for GIC Egbelu Workforce.
          </p>
        </div>

        <form action={createAdmin} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Full Name
            </label>
            <input
              name="fullName"
              required
              className="block w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#0e2d33] focus:ring-4 focus:ring-[#0e2d33]/10"
              placeholder="Admin name"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              username Address
            </label>
            <input
              name="username"
              type="username"
              required
              className="block w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#0e2d33] focus:ring-4 focus:ring-[#0e2d33]/10"
              placeholder="admin@gic.org"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              className="block w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#0e2d33] focus:ring-4 focus:ring-[#0e2d33]/10"
              placeholder="Minimum 8 characters"
            />
            <p className="mt-2 text-xs text-slate-400">
              Password must be at least 8 characters.
            </p>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#0e2d33] py-3 font-semibold text-white transition hover:bg-[#123940]"
          >
            Create Admin Account
          </button>
          <p className="mt-4 text-sm text-slate-500">
          Already have an account? <a href="/login" className="text-[#0e2d33] hover:underline">Login</a>
        </p>
        </form>

        <p className="mt-8 text-center text-xs text-slate-400">
          This page is disabled automatically after the first admin is created.
        </p>
      </section>
    </main>
  );
}