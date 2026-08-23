"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BedDouble, CheckCircle2, MapPin, Ruler, UserRound } from "lucide-react";
import { toast } from "sonner";
import type { Property } from "@/lib/types";
import { createRental } from "@/lib/api/rentals";
import { getCurrentUser } from "@/lib/auth";
import { getImageUrl } from "@/lib/utils/image";

export function PropertyDetails({ property }: { property: Property }) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function submit() {
    const user = getCurrentUser();
    if (!user) {
      window.location.href = "/auth/login";
      return;
    }
    setSubmitting(true);
    try {
      await createRental({ propertyId: property.id, moveInDate: new Date().toISOString(), duration: 12, message });
      toast.success("Rental request submitted successfully.");
      setOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not submit request.");
    } finally {
      setSubmitting(false);
    }
  }

  const images = property.images?.length
  ? property.images
  : [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80",
    ];

const imageUrls = images.map(getImageUrl);

  return (
    <div className="container-page py-10">
      <div className="grid gap-3 md:grid-cols-2">
        <div className="relative h-80 overflow-hidden rounded-2xl md:h-[520px]">
          <Image src={images[0]} alt={property.title} fill className="object-cover" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {images.slice(1, 5).map((image, index) => (
            <div key={image + index} className="relative min-h-40 overflow-hidden rounded-2xl">
              <Image src={image} alt={`${property.title} ${index + 2}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">{property.category?.name || "Property"}</span>
              <h1 className="mt-3 text-3xl font-bold">{property.title}</h1>
              <p className="mt-2 flex items-center gap-1 text-slate-500"><MapPin className="h-4 w-4" /> {`${property.address}, ${property.city}`}</p>
            </div>
            <p className="text-2xl font-bold text-brand-700">${property.rent}<span className="text-sm font-medium text-slate-400">/month</span></p>
          </div>

          <div className="mt-7 flex flex-wrap gap-5 border-y border-slate-200 py-5 text-sm text-slate-600">
            <span className="flex items-center gap-2"><BedDouble className="h-4 w-4" /> {property.bedrooms} bedrooms</span>
            <span className="flex items-center gap-2"><Ruler className="h-4 w-4" /> {property.bathrooms} bathrooms</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Available</span>
          </div>

          <h2 className="mt-8 text-xl font-bold">About this property</h2>
          <p className="mt-3 leading-7 text-slate-600">{property.description}</p>

          <h2 className="mt-8 text-xl font-bold">Amenities</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {(property.amenities || []).map((amenity) => <span key={amenity} className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-600">{amenity}</span>)}
          </div>

          <div className="mt-8 flex items-center gap-3 rounded-2xl bg-slate-100 p-5">
            <div className="rounded-full bg-white p-3"><UserRound className="h-5 w-5" /></div>
            <div><p className="font-semibold">Listed by {property.landlord?.name || "Property owner"}</p><p className="text-sm text-slate-500">{property.landlord?.email || "Verified landlord"}</p></div>
          </div>
        </div>

        <aside className="card h-fit p-6 lg:sticky lg:top-24">
          <h3 className="text-lg font-bold">Interested in this property?</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">Send a rental request to the landlord. Once approved, you can proceed to secure payment.</p>
          <button onClick={() => setOpen(true)} className="btn-primary mt-6 w-full">Request to Rent</button>
          <Link href="/properties" className="btn-secondary mt-3 w-full">Back to listings</Link>
        </aside>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="card w-full max-w-lg p-6">
            <h2 className="text-xl font-bold">Request to rent</h2>
            <p className="mt-1 text-sm text-slate-500">Tell the landlord why this property is a good fit.</p>
            <textarea className="input mt-5 min-h-32" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Your message..." />
            <div className="mt-5 flex justify-end gap-3">
              <button className="btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
              <button className="btn-primary" disabled={submitting} onClick={submit}>{submitting ? "Submitting..." : "Submit request"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
