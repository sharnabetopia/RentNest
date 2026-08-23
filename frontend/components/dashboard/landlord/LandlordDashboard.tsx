"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Building2,
  DollarSign,
  Plus,
  Users,
  type LucideIcon,
} from "lucide-react";
import { getLandlordProperties, getLandlordRequests } from "@/lib/api/landlord";
import type { Property, Rental } from "@/lib/types";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function LandlordDashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [requests, setRequests] = useState<Rental[]>([]);

  useEffect(() => {
    Promise.all([getLandlordProperties(), getLandlordRequests()])
      .then(([p, r]) => {
        setProperties(p.data);
        setRequests(r.data);
      })
      .catch(() => {});
  }, []);

  const stats: {
    icon: LucideIcon;
    label: string;
    value: number;
  }[] = [
    {
      icon: Building2,
      label: "Properties",
      value: properties.length,
    },
    {
      icon: Users,
      label: "Active requests",
      value: requests.filter((x) => x.status === "PENDING").length,
    },
    {
      icon: DollarSign,
      label: "Approved",
      value: requests.filter((x) => x.status === "APPROVED").length,
    },
    {
      icon: Building2,
      label: "Occupied",
      value: properties.filter((x) => x.status !== "AVAILABLE").length,
    },
  ];

  return (
    <div className="container-page py-10">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
            Landlord dashboard
          </p>
          <h1 className="page-title mt-1">Manage your rentals</h1>
        </div>

        <Link
          href="/dashboard/landlord/properties/new"
          className="btn-primary"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add property
        </Link>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="card p-5">
            <Icon className="h-5 w-5 text-brand-600" />

            <p className="mt-4 text-2xl font-bold">{value}</p>

            <p className="text-sm text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      <section className="card mt-8 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <h2 className="font-bold">Your properties</h2>

          <Link
            href="/dashboard/landlord/properties/new"
            className="text-sm font-semibold text-brand-700"
          >
            New listing
          </Link>
        </div>

        {properties.length ? (
          properties.map((property) => (
            <div
              key={property.id}
              className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-semibold">{property.title}</p>

                <p className="mt-1 text-sm text-slate-500">
                  {`${property.address}, ${property.city}`} · $
                  {property.rent}/month
                </p>
              </div>

              <div className="flex gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    property.status === "AVAILABLE"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {property.status === "AVAILABLE"
                    ? "Available"
                    : "Unavailable"}
                </span>

                <Link
                  href={`/dashboard/landlord/properties/${property.id}/edit`}
                  className="btn-secondary"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="p-10 text-center text-sm text-slate-500">
            No properties listed.
          </div>
        )}
      </section>

      <section className="card mt-8 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <h2 className="font-bold">Latest requests</h2>

          <Link
            href="/dashboard/landlord/requests"
            className="text-sm font-semibold text-brand-700"
          >
            Manage all
          </Link>
        </div>

        {requests.slice(0, 5).map((r) => (
          <div
            key={r.id}
            className="flex items-center justify-between border-b border-slate-100 p-5 last:border-0"
          >
            <div>
              <p className="font-semibold">
                {r.property?.title || `Request #${r.id}`}
              </p>

              <p className="text-sm text-slate-500">
                {r.tenant?.name || "Tenant"}
              </p>
            </div>

            <StatusBadge status={r.status} />
          </div>
        ))}
      </section>
    </div>
  );
}