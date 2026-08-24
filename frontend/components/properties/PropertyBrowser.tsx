"use client";

import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { getCategories, getProperties } from "@/lib/api/properties";
import type { Property, PropertyFilters } from "@/lib/types";
import { PropertyCard } from "./PropertyCard";
import { PageSkeleton } from "@/components/ui/PageSkeleton";

type BrowserFilters = PropertyFilters & {
  propertyType?: string;
  amenities?: string[];
  search?: string;
  location?: string;
};

export function PropertyBrowser() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [filters, setFilters] = useState<BrowserFilters>({});
  const [loading, setLoading] = useState(true);
  const [mobileFilters, setMobileFilters] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const response = await getProperties(filters);
      setProperties(response.data);
    } catch {
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getCategories().then((r) => setCategories(r.data.map((x) => x.name))).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const timer = setTimeout(load, 250);
    return () => clearTimeout(timer);
  }, [filters]);

  function clear() {
    setFilters({});
  }

  const FilterPanel = () => (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Filters</h2>
        <button onClick={clear} className="text-xs font-semibold text-brand-700">Clear all</button>
      </div>
      <div>
        <label className="label">Location</label>
        <input className="input" value={filters.location || ""} onChange={(e) => setFilters({ ...filters, location: e.target.value })} placeholder="Dhaka, Dhanmondi..." />
      </div>
      <div>
        <label className="label">Property type</label>
        <select className="input" value={filters.propertyType || ""} onChange={(e) => setFilters({ ...filters, propertyType: e.target.value || undefined })}>
          <option value="">All types</option>
          {(categories.length ? categories : ["APARTMENT", "HOUSE", "ROOM", "STUDIO"]).map((x) => <option key={x} value={x}>{x}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Min price</label>
          <input type="number" className="input" value={filters.minPrice ?? ""} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })} />
        </div>
        <div>
          <label className="label">Max price</label>
          <input type="number" className="input" value={filters.maxPrice ?? ""} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })} />
        </div>
      </div>
      <div>
        <label className="label">Amenities</label>
        <div className="space-y-2">
          {["Parking", "WiFi", "AC", "Security", "Gym"].map((amenity) => {
            const selected = filters.amenities?.includes(amenity);
            return (
              <label key={amenity} className="flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" checked={selected || false} onChange={() => {
                  const current = filters.amenities || [];
                  setFilters({ ...filters, amenities: selected ? current.filter((x) => x !== amenity) : [...current, amenity] });
                }} />
                {amenity}
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );

  if (loading && !properties.length) return <PageSkeleton />;

  return (
    <div className="container-page py-10">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Marketplace</p>
        <h1 className="page-title mt-1">Find your next home</h1>
        <p className="mt-2 text-slate-500">Search by location, budget, type, and amenities.</p>
      </div>

      <div className="mb-5 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
          <input className="input pl-10" placeholder="Search properties..." value={filters.search || ""} onChange={(e) => setFilters((current) => ({ ...current, search: e.target.value }))} />
        </div>
        <button className="btn-secondary lg:hidden" onClick={() => setMobileFilters(true)}><SlidersHorizontal className="mr-2 h-4 w-4" /> Filters</button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="card hidden h-fit p-5 lg:block"><FilterPanel /></aside>
        <section>
          <div className="mb-4 text-sm text-slate-500">{properties.length} properties found</div>
          {properties.length ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {properties.map((property) => <PropertyCard key={property.id} property={property} />)}
            </div>
          ) : (
            <div className="card p-12 text-center">
              <h3 className="font-semibold">No properties match your filters</h3>
              <button onClick={clear} className="mt-4 text-sm font-semibold text-brand-700">Reset filters</button>
            </div>
          )}
        </section>
      </div>

      {mobileFilters && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 lg:hidden">
          <div className="ml-auto h-full w-full max-w-sm overflow-y-auto bg-white p-5">
            <div className="mb-5 flex justify-end"><button onClick={() => setMobileFilters(false)}><X /></button></div>
            <FilterPanel />
          </div>
        </div>
      )}
    </div>
  );
}
