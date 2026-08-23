import Link from "next/link";
import { ArrowRight, CheckCircle2, Home, ShieldCheck, Sparkles } from "lucide-react";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { getProperties } from "@/lib/api/properties";

export default async function HomePage() {
  const response = await getProperties().catch(() => ({ data: [] }));
  const properties = response.data.slice(0, 6);

  return (
    <div>
      <section className="bg-slate-950 py-20 text-white">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-200">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              Smarter renting starts here
            </div>
            <h1 className="max-w-2xl text-4xl font-bold leading-tight sm:text-6xl">
              Find a place you&apos;ll love to call home.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
              Browse verified rental properties, send requests online, and complete your payment securely.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/properties" className="btn-primary bg-emerald-500 hover:bg-emerald-600">
                Explore Properties <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href="/auth/register" className="btn-secondary border-white/20 bg-white/5 text-white hover:bg-white/10">
                List Your Property
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              ["Verified listings", "1,200+"],
              ["Happy tenants", "3,500+"],
              ["Cities covered", "18"],
              ["Secure payments", "100%"]
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <p className="text-3xl font-bold">{value}</p>
                <p className="mt-2 text-sm text-slate-300">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
