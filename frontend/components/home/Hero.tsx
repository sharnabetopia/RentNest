import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Search, MapPin } from "lucide-react";

const STATS = [
  ["1,200+", "verified listings"],
  ["3,500+", "happy tenants"],
  ["18", "cities covered"],
  ["100%", "secure payments"],
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-32 text-white sm:py-40 min-h-screen  ">
      {/* Background photo */}
      <Image
        src="/hero.jpg"
        alt=""
        fill
        priority
        className="object-cover object-center"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/10 to-transparent" />

      <div className="container-page relative">
        <div className="max-w-xl">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
            Smarter renting
          </p>

          <h1 className="text-5xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">
            Find a place you&apos;ll love to call home.
          </h1>

          <p className="mt-6 max-w-md text-lg leading-8 text-white/80">
            Browse verified rental properties, send requests online, and
            complete your payment securely.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/properties"
              className="inline-flex items-center rounded-md bg-white px-7 py-3.5 text-sm font-semibold text-[#14181F] transition hover:bg-white/90"
            >
              Explore properties
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center rounded-md border border-white/50 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15"
            >
              List your property
            </Link>
          </div>
        </div>

        {/* Stat row */}
        <div className="mt-14 flex max-w-2xl flex-wrap divide-x divide-white/20 border-t border-white/20 pt-7">
          {STATS.map(([value, label]) => (
            <div key={label} className="px-6 first:pl-0">
              <p className="text-2xl font-semibold tracking-tight">{value}</p>
              <p className="mt-1 text-sm text-white/60">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
