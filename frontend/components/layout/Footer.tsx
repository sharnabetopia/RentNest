import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  Home,
  LogIn,
  Search,
  ShieldCheck,
  UserPlus,
} from "lucide-react";

const exploreLinks = [
  { href: "/properties", label: "Browse properties", icon: Search },
  { href: "/auth/register", label: "List your property", icon: Building2 },
];

const accountLinks = [
  { href: "/auth/login", label: "Sign in", icon: LogIn },
  { href: "/auth/register", label: "Create an account", icon: UserPlus },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-brand-50/40 text-slate-600">
      <div className="container-page py-14">
        <div className="grid gap-12 border-b border-slate-200 pb-12 lg:grid-cols-[1.5fr_1fr_1fr_1.35fr]">
          <div className="max-w-sm">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-2xl font-bold tracking-tight text-slate-900"
            >
              <Home className="h-5 w-5 text-brand-700" />
              RentNest
            </Link>
            <p className="mt-5 text-sm leading-6 text-slate-500">
              Find a home that fits your life, or connect with the right tenant
              for your property.
            </p>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
              Renting, made clear.
            </p>
          </div>

          <nav
            aria-label="Explore RentNest"
            className="flex flex-col gap-4 text-sm"
          >
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Explore
            </h2>
            {exploreLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="group inline-flex items-center gap-2 transition hover:text-brand-700"
              >
                <Icon className="h-4 w-4 text-slate-400 transition group-hover:text-brand-600" />
                {label}
              </Link>
            ))}
          </nav>

          <nav
            aria-label="RentNest account"
            className="flex flex-col gap-4 text-sm"
          >
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Your account
            </h2>
            {accountLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="group inline-flex items-center gap-2 transition hover:text-brand-700"
              >
                <Icon className="h-4 w-4 text-slate-400 transition group-hover:text-brand-600" />
                {label}
              </Link>
            ))}
          </nav>

          <div className="border-t border-slate-200 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              <ShieldCheck className="h-4 w-4 text-brand-700" />A more confident
              move
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Browse verified listings and manage every step of your rental
              journey in one place.
            </p>
            <Link
              href="/properties"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 transition hover:text-brand-900"
            >
              Start exploring <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} RentNest. All rights reserved.</p>
          <p>Built for better renting.</p>
        </div>
      </div>
    </footer>
  );
}
