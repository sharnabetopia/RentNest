"use client";

import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { getCategories, getProperties } from "@/lib/api/properties";
import type { Property, PropertyFilters, Category } from "@/lib/types";
import { PropertyCard } from "./PropertyCard";
import { PageSkeleton } from "@/components/ui/PageSkeleton";

type BrowserFilters = {
  searchTerm?: string;
  city?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
};

export function PropertyBrowser() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [city, setCity] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [loading, setLoading] = useState(true);
  const [mobileFilters, setMobileFilters] = useState(false);

  useEffect(() => {
    getCategories().then((r) => setCategories(r.data)).catch(() => setCategories([]));
    load();
  }, []);

  // Filter by search + sidebar filters — only applied on button click

  async function load() {
    setLoading(true);
    try {
      const response = await getProperties({
        searchTerm: searchTerm || undefined,
        city: city || undefined,
        categoryId: categoryId || undefined,
        minPrice,
        maxPrice,
      });
      setProperties(response.data);
    } catch {
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch() {
    load();
  }

  function handleClear() {
    setSearchTerm("");
    setCity("");
    setCategoryId("");
    setMinPrice(undefined);
    setMaxPrice(undefined);
    load();
  }

  const FilterPanel = () => (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Filters</h2>
        <button onClick={handleClear} className="text-xs font-semibold text-brand-700">Clear all</button>
      </div>
      <div>
        <label className="label">Location</label>
        <input className="input" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Dhaka, Dhanmondi..." />
      </div>
      <div>
        <label className="label">Category</label>
        <select className="input" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Min price</label>
          <input type="number" className="input" value={minPrice ?? ""} onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)} />
        </div>
        <div>
          <label className="label">Max price</label>
          <input type="number" className="input" value={maxPrice ?? ""} onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)} />
        </div>
      </div>
      <button onClick={() => load()} className="btn-primary w-full">
        Apply & Search
      </button>
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
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input className="input !pl-12" placeholder="Search properties..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <button onClick={handleSearch} className="btn-primary whitespace-nowrap">
          Search
        </button>
        <button onClick={handleClear} className="btn-secondary whitespace-nowrap">
          Clear
        </button>
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
              <button onClick={handleClear} className="mt-4 text-sm font-semibold text-brand-700">Reset filters</button>
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
