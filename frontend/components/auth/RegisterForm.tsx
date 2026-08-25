"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { register } from "@/lib/api/auth";

export function RegisterForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "TENANT",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function change(key: keyof typeof form, value: string) {
    setForm((x) => ({ ...x, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Name is required.";
    if (!form.email.includes("@")) next.email = "Enter a valid email.";
    if (form.password.length < 6)
      next.password = "Password must be at least 6 characters.";
    if (form.password !== form.confirmPassword)
      next.confirmPassword = "Passwords do not match.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      const response = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      toast.success("Account created successfully. Please sign in.");
      window.location.href = "/auth/login";
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Registration failed.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-page flex min-h-[calc(100vh-72px)] items-center justify-center py-10">
      <form onSubmit={submit} className="card w-full max-w-lg p-7">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="mt-1 text-sm text-slate-500">
          Choose how you want to use RentNest.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label">Full name</label>
            <input
              className="input"
              value={form.name}
              onChange={(e) => change("name", e.target.value)}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name}</p>
            )}
          </div>
          <div className="sm:col-span-2">
            <label className="label">Email</label>
            <input
              className="input"
              type="email"
              value={form.email}
              onChange={(e) => change("email", e.target.value)}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email}</p>
            )}
          </div>
          <div>
            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              value={form.password}
              onChange={(e) => change("password", e.target.value)}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password}</p>
            )}
          </div>
          <div>
            <label className="label">Confirm password</label>
            <input
              className="input"
              type="password"
              value={form.confirmPassword}
              onChange={(e) => change("confirmPassword", e.target.value)}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        <div className="mt-5">
          <label className="label">Account type</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              ["TENANT", "Tenant", "Find and rent properties"],
              ["LANDLORD", "Landlord", "List and manage properties"],
            ].map(([value, title, text]) => (
              <button
                key={value}
                type="button"
                onClick={() => change("role", value)}
                className={`rounded-xl border p-4 text-left ${form.role === value ? "border-brand-500 bg-brand-50" : "border-slate-200"}`}
              >
                <p className="font-semibold">{title}</p>
                <p className="mt-1 text-xs text-slate-500">{text}</p>
              </button>
            ))}
          </div>
        </div>

        <button className="btn-primary mt-6 w-full" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>
        <p className="mt-5 text-center text-sm text-slate-500">
          Already registered?{" "}
          <Link href="/auth/login" className="font-semibold text-brand-700">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
