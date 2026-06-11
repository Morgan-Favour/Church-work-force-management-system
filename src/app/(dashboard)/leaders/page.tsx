import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { UserCog } from "lucide-react";

async function createLeader(formData: FormData) {
  "use server";

  const fullName = formData.get("fullName")?.toString().trim();
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString();
  const departmentId = formData.get("departmentId")?.toString();

  console.log("CREATE LEADER FORM DATA:", {
    fullName,
    email,
    passwordLength: password?.length,
    departmentId,
  });

  if (!fullName || !email || !password || !departmentId) {
    console.log("Missing required field");
    return;
  }

  if (password.length < 8) {
    console.log("Password too short");
    return;
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log("User already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const leader = await prisma.user.create({
    data: {
      fullName,
      email,
      password: hashedPassword,
      role: UserRole.DEPARTMENT_LEADER,
      departmentId,
    },
  });

  console.log("Leader created:", leader.email);

  revalidatePath("/leaders");
  revalidatePath("/dashboard");
}

export default async function LeadersPage() {
  const departments = await prisma.department.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  const leaders = await prisma.user.findMany({
    where: { role: UserRole.DEPARTMENT_LEADER },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-medium text-[#0e2d33]">Leaders</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Manage Department Leaders
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          Create login accounts for department leaders and assign them to their
          departments.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0e2d33]/10 text-[#0e2d33]">
              <UserCog size={22} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">Add Leader</h2>
              <p className="text-sm text-slate-500">
                Create a department leader account.
              </p>
            </div>
          </div>

          <form action={createLeader} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Full Name
              </label>
              <input
                name="fullName"
                required
                className="block w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#0e2d33] focus:ring-4 focus:ring-[#0e2d33]/10"
                placeholder="Leader name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                required
                className="block w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#0e2d33] focus:ring-4 focus:ring-[#0e2d33]/10"
                placeholder="leader@gic.org"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                minLength={8}
                className="block w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#0e2d33] focus:ring-4 focus:ring-[#0e2d33]/10"
                placeholder="Minimum 8 characters"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Department
              </label>
              <select
                name="departmentId"
                required
                className="block w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#0e2d33] focus:ring-4 focus:ring-[#0e2d33]/10"
              >
                <option value="">Select department</option>
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-[#0e2d33] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#123940]"
            >
              Create Leader
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">Leader List</h2>
            <p className="text-sm text-slate-500">
              {leaders.length} leader(s) created
            </p>
          </div>

          {leaders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center">
              <p className="font-semibold text-slate-700">No leaders yet</p>
              <p className="mt-1 text-sm text-slate-500">
                Create a leader after creating departments.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {leaders.map((leader) => {
                const department = departments.find(
                  (item) => item.id === leader.departmentId
                );

                return (
                  <div
                    key={leader.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 p-4"
                  >
                    <div>
                      <h3 className="font-bold text-slate-900">
                        {leader.fullName}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {leader.email}
                      </p>
                      <p className="mt-1 text-xs font-medium text-[#0e2d33]">
                        {department?.name || "No department assigned"}
                      </p>
                    </div>

                    <span className="rounded-full bg-[#0e2d33]/10 px-3 py-1 text-xs font-semibold text-[#0e2d33]">
                      Leader
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}