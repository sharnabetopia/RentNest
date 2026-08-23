import Link from "next/link";
import { ArrowRight, CheckCircle2, Home, ShieldCheck, Sparkles } from "lucide-react";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { getProperties } from "@/lib/api/properties";
import Hero from "@/components/home/Hero";

export default async function HomePage() {
  const response = await getProperties().catch(() => ({ data: [] }));
  const properties = response.data.slice(0, 6);

  return (
    <div>
      <Hero/>

      <section className="container-page py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Featured</p>
            <h2 className="mt-1 text-3xl font-bold">Popular properties</h2>
          </div>
          <Link href="/properties" className="text-sm font-semibold text-brand-700">View all →</Link>
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
            <p className="mt-1 text-sm text-slate-500">Connect the backend and add your first listings.</p>
          </div>
        )}
      </section>

      <section className="bg-white py-16">
        <div className="container-page grid gap-6 md:grid-cols-3">
          {[
            [ShieldCheck, "Trusted listings", "Property information comes directly from your marketplace API."],
            [CheckCircle2, "Simple requests", "Tenants can submit, track, and pay for approved rental requests."],
            [Sparkles, "Role-based dashboards", "Tenant, landlord, and admin experiences stay focused and secure."]
          ].map(([Icon, title, text]) => (
            <div key={title as string} className="card p-6">
              <div className="inline-flex rounded-xl bg-brand-50 p-3 text-brand-700">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{title as string}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{text as string}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
