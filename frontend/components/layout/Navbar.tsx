"use client";

import Link from "next/link";
import { Home, LogIn, Menu, UserPlus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { clearAuth, getCurrentUser } from "@/lib/auth";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<ReturnType<typeof getCurrentUser>>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const dashboard =
    user?.role === "ADMIN"
      ? "/dashboard/admin"
      : user?.role === "LANDLORD"
        ? "/dashboard/landlord"
        : "/dashboard/tenant";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="container-page flex h-[72px] items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-slate-900"
        >
          <span className="rounded-xl bg-brand-600 p-2 text-white">
            <Home className="h-5 w-5" />
          </span>
          <span className="text-xl">RentNest</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/properties"
            className="text-sm font-medium text-slate-600 hover:text-brand-700"
          >
            Properties
          </Link>
          {user ? (
            <>
              <Link
                href={dashboard}
                className="text-sm font-medium text-slate-600 hover:text-brand-700"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  clearAuth();
                  window.location.href = "/";
                }}
                className="text-sm font-semibold text-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="flex items-center gap-1.5 text-sm font-medium text-slate-600"
              >
                <LogIn className="h-4 w-4" /> Login
              </Link>
              <Link href="/auth/register" className="btn-primary">
                <UserPlus className="mr-2 h-4 w-4" /> Register
              </Link>
            </>
          )}
        </nav>

        <button
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white p-4 md:hidden">
          <div className="container-page flex flex-col gap-4">
            <Link href="/properties" onClick={() => setOpen(false)}>
              Properties
            </Link>
            {user ? (
              <>
                <Link href={dashboard} onClick={() => setOpen(false)}>
                  Dashboard
                </Link>
                <button
                  className="text-left text-red-600"
                  onClick={() => {
                    clearAuth();
                    window.location.href = "/";
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" onClick={() => setOpen(false)}>
                  Login
                </Link>
                <Link href="/auth/register" onClick={() => setOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
