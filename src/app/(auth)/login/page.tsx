import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  const adminExists = await prisma.user.count({
    where: {
      role: "ADMIN",
    },
  });

  if (adminExists === 0) {
    redirect("/register-admin");
  }

  return <LoginForm />;
}