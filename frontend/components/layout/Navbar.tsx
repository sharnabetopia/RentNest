"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LogIn, Menu, UserPlus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { clearAuth, getCurrentUser } from "@/lib/auth";

export function Navbar() {
  const pathname = usePathname();
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

  const isCurrentPath = (href: string) => {
    if (href === "/") return pathname === href;
    if (href === dashboard) return pathname.startsWith(dashboard);
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const linkClass = (href: string) =>
    `text-sm font-medium transition-colors ${
      isCurrentPath(href)
        ? "text-brand-700"
        : "text-slate-600 hover:text-brand-700"
    }`;

  const mobileLinkClass = (href: string) =>
    `transition-colors ${
      isCurrentPath(href)
        ? "text-brand-700 font-semibold"
        : "text-slate-700 hover:text-brand-700"
    }`;

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
            className={linkClass("/properties")}
            aria-current={isCurrentPath("/properties") ? "page" : undefined}
          >
            Properties
          </Link>
          {user ? (
            <>
              <Link
                href={dashboard}
                className={linkClass(dashboard)}
                aria-current={isCurrentPath(dashboard) ? "page" : undefined}
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
                className={`${linkClass("/auth/login")} flex items-center gap-1.5`}
                aria-current={isCurrentPath("/auth/login") ? "page" : undefined}
              >
                <LogIn className="h-4 w-4" /> Login
              </Link>
              <Link
                href="/auth/register"
                className="btn-primary"
                aria-current={isCurrentPath("/auth/register") ? "page" : undefined}
              >
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
            <Link
              href="/properties"
              onClick={() => setOpen(false)}
              className={mobileLinkClass("/properties")}
              aria-current={isCurrentPath("/properties") ? "page" : undefined}
            >
              Properties
            </Link>
            {user ? (
              <>
                <Link
                  href={dashboard}
                  onClick={() => setOpen(false)}
                  className={mobileLinkClass(dashboard)}
                  aria-current={isCurrentPath(dashboard) ? "page" : undefined}
                >
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
                <Link
                  href="/auth/login"
                  onClick={() => setOpen(false)}
                  className={mobileLinkClass("/auth/login")}
                  aria-current={isCurrentPath("/auth/login") ? "page" : undefined}
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setOpen(false)}
                  className={mobileLinkClass("/auth/register")}
                  aria-current={isCurrentPath("/auth/register") ? "page" : undefined}
                >
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
