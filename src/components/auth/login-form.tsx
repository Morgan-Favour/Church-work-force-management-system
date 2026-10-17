"use client";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, LockKeyhole } from "lucide-react";
import { PasswordInput } from "@/components/ui/password-ui";

export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter your username and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await signIn("credentials", {
        username: username.trim().toLowerCase(),
        password,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (res?.error) {
        setError("Username or password is incorrect, or this account is no longer active.");
        return;
      }

      if (res?.url) {
        router.push(res.url);
        return;
      }

      setError("Username or password is incorrect, or this account is no longer active.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
  <section className="grid w-full overflow-hidden rounded-4xl border border-border bg-card shadow-2xl shadow-black/10 lg:grid-cols-[1fr_430px]">
    {/* Left Branding Side (Earthy Dark/Primary Hero Block) */}
    <div className="hidden bg-accent p-10 text-accent-foreground lg:flex lg:flex-col lg:justify-between">
      <div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-foreground backdrop-blur-sm">
          <Image
            src="/logo.png"
            alt="GIC Egbelu Workforce"
            width={120}
            height={120}
            loading="eager"
            priority
          />
        </div>

        <h1 className="mt-10 max-w-md text-4xl font-bold leading-tight">
          GIC Egbelu Workforce
        </h1>

        <p className="mt-4 max-w-md text-sm leading-6 opacity-80">
          A simple internal system for managing departments, workers,
          attendance, and accountability.
        </p>
      </div>

      <div className="rounded-3xl border border-accent-foreground/10 bg-card/10 p-5 backdrop-blur-xs">
        <p className="text-sm font-semibold text-primary">
          Workforce Management
        </p>
        <p className="mt-2 text-sm leading-6 opacity-80">
          Built for church administrators and department leaders.
        </p>
      </div>
    </div>

    {/* Right Form Side */}
    <div className="p-8 sm:p-10">
      <div className="mb-8">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <LockKeyhole size={23} />
        </div>

        <h2 className="text-3xl font-bold tracking-tight text-card-foreground">
          Welcome back
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to access your workforce dashboard.
        </p>
      </div>

      {error && (
        <div className="mb-5 flex gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm font-semibold text-destructive shadow-sm">
          <AlertCircle className="mt-0.5 shrink-0" size={18} />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-semibold text-card-foreground">
            Username
          </label>
          <input
            type="text"
            autoComplete="username"
            className="w-full rounded-2xl border border-input bg-card px-4 py-3 text-sm text-card-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
            placeholder="admin"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <PasswordInput
            name="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            placeholder="Enter password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-90 disabled:opacity-70"
        >
          {loading ? "Signing in..." : "Sign in"}
          {!loading && <ArrowRight size={17} />}
        </button>
      </form>
    </div>
  </section>
);
}