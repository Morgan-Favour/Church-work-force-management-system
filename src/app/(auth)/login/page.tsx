import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage() {
  const userCount = await prisma.user.count();

  if (userCount === 0) {
    redirect("/register-admin");
  }

  return <LoginForm />;
}