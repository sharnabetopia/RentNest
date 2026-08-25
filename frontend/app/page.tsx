import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Home,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { getProperties } from "@/lib/api/properties";
import Hero from "@/components/home/Hero";

export default async function HomePage() {
  const response = await getProperties().catch(() => ({ data: [] }));
  const properties = response.data.slice(0, 6);

  return (
    <div>
      <Hero />

      <section className="container-page py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
              Featured
            </p>
            <h2 className="mt-1 text-3xl font-bold">Popular properties</h2>
          </div>
          <Link
            href="/properties"
            className="text-sm font-semibold text-brand-700 flex items-center gap-1"
          >
            View all <ArrowRight size={16}/>
          </Link>
        </div>
        {properties.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {properties.slice(0, 4).map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="card p-10 text-center">
            <Home className="mx-auto h-10 w-10 text-slate-400" />
            <h3 className="mt-3 font-semibold">No featured properties yet</h3>
            <p className="mt-1 text-sm text-slate-500">
              Connect the backend and add your first listings.
            </p>
          </div>
        )}
      </section>

      <section className="bg-white py-24">
        <div className="container-page">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">
              Why RentNest
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Built for how renting actually works.
            </h2>
          </div>

          <div className="mt-14 grid divide-y divide-slate-200 border-t border-slate-200 md:grid-cols-3 md:divide-x md:divide-y-0">
            {[
              [
                ShieldCheck,
                "01",
                "Trusted listings",
                "Property information comes directly from your marketplace API — no manual re-entry, no stale data.",
              ],
              [
                CheckCircle2,
                "02",
                "Simple requests",
                "Tenants can submit, track, and pay for approved rental requests without a single phone call.",
              ],
              [
                Sparkles,
                "03",
                "Role-based dashboards",
                "Tenant, landlord, and admin experiences stay focused, permissioned, and easy to reason about.",
              ],
            ].map(([Icon, index, title, text]) => (
              <div
                key={title as string}
                className="flex flex-col gap-4 py-8 pr-8 md:py-2 md:pl-8 md:first:pl-0"
              >
                <div className="flex items-center justify-between">
                  <Icon className="h-5 w-5 text-brand-700" />
                  <span className="font-mono text-xs text-slate-300">
                    {index as string}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {title as string}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {text as string}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
