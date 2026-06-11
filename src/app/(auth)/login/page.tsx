"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.ok) {
      router.push("/dashboard");
    } else {
      alert("Invalid credentials");
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-3xl bg-white p-8 shadow-2xl shadow-slate-200">
        <div className="mb-8 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0e2d33]/10">
            <LockKeyhole className="text-[#0e2d33]" size={24} />
          </div>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[#0e2d33]">
            GIC Egbelu
          </h1>

          <p className="mt-2 text-slate-500">
            Workforce Management System
          </p>
        </div>

        <form onSubmit={handleLogin} className="">
          <div>
            <label className="m-2 block text-sm font-medium text-slate-700">
              Email Address
            </label>

            <input
              type="email"
              placeholder="admin@gic.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className=""
            />
          </div>

          <div>
            <label className="m-2 block text-sm font-medium text-slate-700">
              Password
            </label>

            <div className="px-6">
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#0e2d33] focus:ring-4 focus:ring-[#0e2d33]/10"
            />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#0e2d33] py-3 px-8 font-semibold text-white transition hover:bg-[#123940]"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 border-t pt-6 text-center">
          <p className="text-xs text-slate-400">
            Secure access for authorized church leaders only
          </p>
        </div>
      </div>
    </div>
  );
}