"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, LockKeyhole } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    const res = await signIn("credentials", {
      email: email.trim().toLowerCase(),
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.ok) {
      router.replace("/dashboard");
      router.refresh();
    } else {
      setError("Invalid email or password.");
    }
  }

  return (
    <section className="grid w-full overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-2xl shadow-slate-300/50 lg:grid-cols-[1fr_430px]">
      <div className="hidden bg-[#0e2d33] p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-xl font-bold text-[#d4af37]">
            G
          </div>

          <h1 className="mt-10 max-w-md text-4xl font-bold leading-tight">
            GIC Egbelu Workforce
          </h1>

          <p className="mt-4 max-w-md text-sm leading-6 text-white/65">
            A simple internal system for managing departments, workers,
            attendance, and accountability.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
          <p className="text-sm font-semibold text-[#d4af37]">
            Workforce Management
          </p>
          <p className="mt-2 text-sm leading-6 text-white/65">
            Built for church administrators and department leaders.
          </p>
        </div>
      </div>

      <div className="p-8 sm:p-10">
        <div className="mb-8">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0e2d33]/10 text-[#0e2d33]">
            <LockKeyhole size={23} />
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-slate-950">
            Welcome back
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Sign in to access your workforce dashboard.
          </p>
        </div>

        {error && (
          <div className="mb-5 flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={18} />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Email address
            </label>
            <input
              type="email"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#0e2d33] focus:bg-white focus:ring-4 focus:ring-[#0e2d33]/10"
              placeholder="admin@gic.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#0e2d33] focus:bg-white focus:ring-4 focus:ring-[#0e2d33]/10"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0e2d33] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-[#0e2d33]/20 transition hover:bg-[#123940] disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Sign in"}
            {!loading && <ArrowRight size={17} />}
          </button>
        </form>
      </div>
    </section>
  );
}