import Image from "next/image";
import Link from "next/link";
import { BedDouble, MapPin, Ruler } from "lucide-react";

import type { Property } from "@/lib/types";
import { getImageUrl } from "@/lib/utils/image";

export function PropertyCard({ property }: { property: Property }) {
  const image = getImageUrl(property.images?.[0]);

  return (
    <article className="card overflow-hidden">
      <Link
        href={`/properties/${property.id}`}
        className="relative block h-56"
      >
        <Image
          src={image}
          alt={property.title}
          fill
          className="object-cover transition duration-300 hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700">
          {property.category?.name || "Property"}
        </div>
      </Link>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 font-semibold text-slate-900">
            {property.title}
          </h3>

          <p className="whitespace-nowrap font-bold text-brand-700">
            ${property.rent}/mo
          </p>
        </div>

        <p className="mt-2 flex items-center gap-1 text-sm text-slate-500">
          <MapPin className="h-4 w-4" />
          {`${property.address}, ${property.city}`}
        </p>

        <div className="mt-4 flex gap-4 border-t border-slate-100 pt-4 text-sm text-slate-500">
          <span className="flex items-center gap-1">
            <BedDouble className="h-4 w-4" />
            {property.bedrooms} beds
          </span>

          <span className="flex items-center gap-1">
            <Ruler className="h-4 w-4" />
            {property.bathrooms} baths
          </span>
        </div>
      </div>
    </article>
  );
}