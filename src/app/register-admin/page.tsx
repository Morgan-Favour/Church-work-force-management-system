import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

async function createAdmin(formData: FormData) {
  "use server";

  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      fullName,
      email,
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
  });

  redirect("/login");
}

export default function RegisterAdminPage() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Create Admin Account</h1>

      {/* 👇 THIS IS THE KEY FIX */}
      <form action={createAdmin}>
        <input placeholder="Full Name" name="fullName" />
        <br /><br />

        <input placeholder="Email" name="email" type="email" />
        <br /><br />

        <input placeholder="Password" name="password" type="password" />
        <br /><br />

        <button type="submit">
          Create Admin
        </button>
      </form>
    </div>
  );
}