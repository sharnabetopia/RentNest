"use client";

import Link from "next/link";
import { useState } from "react";
import { LockKeyhole, Mail } from "lucide-react";
import { toast } from "sonner";
import { login } from "@/lib/api/auth";
import { saveAuth } from "@/lib/auth";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!email) next.email = "Email is required.";
    if (!password) next.password = "Password is required.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      const response = await login({ email, password });
      saveAuth(response.data.accessToken, response.data.user);
      toast.success("Welcome back!");
      const role = response.data.user.role;
      window.location.href =
        role === "ADMIN"
          ? "/dashboard/admin"
          : role === "LANDLORD"
            ? "/dashboard/landlord"
            : "/dashboard/tenant";
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-page flex min-h-[calc(100vh-72px)] items-center justify-center py-10">
      <form onSubmit={submit} className="card w-full max-w-md p-7">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-500">
          Sign in to your RentNest account.
        </p>

        <div className="mt-6">
          <label className="label">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              className={`input !pl-10 ${errors.email ? "border-red-500" : ""}`}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email}</p>
          )}
        </div>

        <div className="mt-4">
          <label className="label">Password</label>
          <div className="relative">
            <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              className={`input !pl-10 ${errors.password ? "border-red-500" : ""}`}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">{errors.password}</p>
          )}
        </div>

        <button className="btn-primary mt-6 w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
        <p className="mt-5 text-center text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="font-semibold text-brand-700">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
