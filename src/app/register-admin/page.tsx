import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

async function createAdmin(formData: FormData) {
  "use server";

  const fullName = formData.get("fullName")?.toString().trim();
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString();

  if (!fullName || !email || !password) {
    throw new Error("All fields are required.");
  }

  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }

  const adminCount = await prisma.user.count({
    where: {
      role: UserRole.ADMIN,
    },
  });

  if (adminCount > 0) {
    throw new Error("An admin account already exists.");
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error("Email already exists.");
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
    <main style={{ padding: "2rem", maxWidth: "500px" }}>
      <h1>Create First Admin</h1>

      <form action={createAdmin}>
        <div>
          <label>Full Name</label>
          <br />
          <input
            name="fullName"
            type="text"
            required
          />
        </div>

        <br />

        <div>
          <label>Email</label>
          <br />
          <input
            name="email"
            type="email"
            required
          />
        </div>

        <br />

        <div>
          <label>Password</label>
          <br />
          <input
            name="password"
            type="password"
            required
          />
        </div>

        <br />

        <button type="submit">
          Create Admin
        </button>
      </form>
    </main>
  );
}