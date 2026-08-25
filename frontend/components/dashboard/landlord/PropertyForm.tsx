"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  createLandlordProperty,
  getLandlordProperty,
  updateLandlordProperty,
} from "@/lib/api/landlord";
import { getCategories } from "@/lib/api/properties";
import type { Category } from "@/lib/types";
const empty = {
  title: "",
  description: "",
  address: "",
  city: "",
  rent: "",
  bedrooms: "1",
  bathrooms: "1",
  categoryId: "",
  amenities: "Parking, WiFi",
  images: "",
  status: "AVAILABLE",
};
export function PropertyForm({ propertyId }: { propertyId?: string }) {
  const router = useRouter();
  const [form, setForm] = useState(empty);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getCategories()
      .then((r) => {
        setCategories(r.data);
        if (!propertyId && r.data[0])
          setForm((x) => ({ ...x, categoryId: r.data[0].id }));
      })
      .catch(() => {});
    if (propertyId)
      getLandlordProperty(propertyId)
        .then((r) => {
          const p = r.data;
          setForm({
            title: p.title,
            description: p.description,
            address: p.address,
            city: p.city,
            rent: String(p.rent),
            bedrooms: String(p.bedrooms),
            bathrooms: String(p.bathrooms),
            categoryId: p.categoryId || p.category?.id || "",
            amenities: (p.amenities || []).join(", "),
            images: (p.images || []).join("\n"),
            status: p.status,
          });
        })
        .catch(() => toast.error("Could not load property."));
  }, [propertyId]);
  const set = (k: keyof typeof form, v: string) =>
    setForm((x) => ({ ...x, [k]: v }));
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (
      !form.title ||
      !form.description ||
      !form.address ||
      !form.city ||
      !form.rent ||
      !form.categoryId
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    const payload = {
      title: form.title,
      description: form.description,
      address: form.address,
      city: form.city,
      rent: Number(form.rent),
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      categoryId: form.categoryId,
      amenities: form.amenities
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
      images: form.images
        .split("\n")
        .map((x) => x.trim())
        .filter(Boolean),
      status: form.status,
    };
    try {
      if (propertyId) await updateLandlordProperty(propertyId, payload);
      else await createLandlordProperty(payload);
      toast.success(propertyId ? "Property updated." : "Property created.");
      router.push("/dashboard/landlord");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not save property.",
      );
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="container-page py-10">
      <div className="mb-7">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
          Landlord
        </p>
        <h1 className="page-title mt-1">
          {propertyId ? "Edit property" : "Create property"}
        </h1>
      </div>
      <form onSubmit={submit} className="card mx-auto max-w-3xl p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label">Title *</label>
            <input
              className="input"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Address *</label>
            <input
              className="input"
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
            />
          </div>
          <div>
            <label className="label">City *</label>
            <input
              className="input"
              value={form.city}
              onChange={(e) => set("city", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Monthly rent *</label>
            <input
              className="input"
              type="number"
              value={form.rent}
              onChange={(e) => set("rent", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Category *</label>
            <select
              className="input"
              value={form.categoryId}
              onChange={(e) => set("categoryId", e.target.value)}
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Bedrooms</label>
            <input
              className="input"
              type="number"
              value={form.bedrooms}
              onChange={(e) => set("bedrooms", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Bathrooms</label>
            <input
              className="input"
              type="number"
              value={form.bathrooms}
              onChange={(e) => set("bathrooms", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Amenities</label>
            <input
              className="input"
              value={form.amenities}
              onChange={(e) => set("amenities", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Status</label>
            <select
              className="input"
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
            >
              <option>AVAILABLE</option>
              <option>UNAVAILABLE</option>
              <option>RENTED</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="label">Description *</label>
            <textarea
              className="input min-h-32"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Image URLs (one per line)</label>
            <textarea
              className="input min-h-28"
              value={form.images}
              onChange={(e) => set("images", e.target.value)}
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => router.back()}
          >
            Cancel
          </button>
          <button className="btn-primary" disabled={loading}>
            {loading
              ? "Saving..."
              : propertyId
                ? "Update property"
                : "Create property"}
          </button>
        </div>
      </form>
    </div>
  );
}
