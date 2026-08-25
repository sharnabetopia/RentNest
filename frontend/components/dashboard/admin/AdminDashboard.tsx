"use client";

import { useEffect, useMemo, useState } from "react";
import { Ban, Building2, FileText, Search, ShieldCheck, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { getAdminUsers, updateAdminUser, getAdminProperties, getAdminRentals } from "@/lib/api/admin";
import { PageSkeleton } from "@/components/ui/PageSkeleton";
import type { User, Property, Rental } from "@/lib/types";

type Tab = "users" | "properties" | "rentals";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("users");
  const [users, setUsers] = useState<User[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAdminUsers(), getAdminProperties(), getAdminRentals()])
      .then(([u, p, r]) => {
        setUsers(u.data);
        setProperties(p.data);
        setRentals(r.data);
      })
      .catch(() => toast.error("Could not load dashboard data."))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredUsers = useMemo(
    () =>
      users.filter((u) =>
        `${u.name} ${u.email}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [users, search]
  );

  const filteredProperties = useMemo(
    () =>
      properties.filter((p) =>
        `${p.title} ${p.city} ${p.address}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [properties, search]
  );

  const filteredRentals = useMemo(
    () =>
      rentals.filter((r) =>
        `${r.id} ${r.tenant?.name} ${r.property?.title}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [rentals, search]
  );

  if (isLoading) {
    return <PageSkeleton />;
  }

  async function toggle(user: User) {
    try {
      const next = user.status === "BANNED" ? "ACTIVE" : "BANNED";

      await updateAdminUser(String(user.id), next);

      setUsers((current) =>
        current.map((x) =>
          x.id === user.id ? { ...x, status: next } : x
        )
      );

      toast.success(
        next === "BANNED" ? "User banned." : "User unbanned."
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not update user."
      );
    }
  }

  return (
    <div className="container-page py-10">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Administration</p>
        <h1 className="page-title mt-1">Platform overview</h1>
        <p className="mt-2 text-slate-500">Monitor users and marketplace activity.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {(
          [
            [Users, "Total users", users.length],
            [Building2, "Properties", properties.length],
            [ShieldCheck, "Pending requests", rentals.filter((r) => r.status === "PENDING").length],
            [Ban, "Banned users", users.filter((x) => x.status === "BANNED").length],
          ] as Array<[LucideIcon, string, string | number]>
        ).map(([Icon, label, value]) => (
          <div key={label} className="card p-5">
            <Icon className="h-5 w-5 text-brand-600" />
            <p className="mt-4 text-2xl font-bold">{value}</p>
            <p className="text-sm text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="mt-8 flex gap-2 border-b border-slate-200">
        {(["users", "properties", "rentals"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setSearch(""); }}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === tab
                ? "border-b-2 border-brand-600 text-brand-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab === "users" && <span className="flex items-center gap-2"><Users className="h-4 w-4" /> Users ({users.length})</span>}
            {tab === "properties" && <span className="flex items-center gap-2"><Building2 className="h-4 w-4" /> Properties ({properties.length})</span>}
            {tab === "rentals" && <span className="flex items-center gap-2"><FileText className="h-4 w-4" /> Rentals ({rentals.length})</span>}
          </button>
        ))}
      </div>

      {/* Users Tab */}
      {activeTab === "users" && (
        <section className="card mt-6 overflow-hidden">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center">
            <h2 className="font-bold">User Management</h2>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                className="input pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users..."
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-t border-slate-100">
                    <td className="p-4">
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </td>
                    <td className="p-4">{user.role}</td>
                    <td className="p-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        user.status === "BANNED" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => toggle(user)}
                        className="btn-secondary"
                      >
                        {user.status === "BANNED" ? "Unban" : "Ban"}
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-400">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Properties Tab */}
      {activeTab === "properties" && (
        <section className="card mt-6 overflow-hidden">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center">
            <h2 className="font-bold">All Properties</h2>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                className="input pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search properties..."
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="p-4">Property</th>
                  <th className="p-4">City</th>
                  <th className="p-4">Rent</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Landlord</th>
                </tr>
              </thead>
              <tbody>
                {filteredProperties.map((property) => (
                  <tr key={property.id} className="border-t border-slate-100">
                    <td className="p-4">
                      <p className="font-semibold">{property.title}</p>
                      <p className="text-xs text-slate-500">{property.address}</p>
                    </td>
                    <td className="p-4">{property.city}</td>
                    <td className="p-4">${Number(property.rent).toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        property.status === "AVAILABLE" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                      }`}>
                        {property.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {property.landlord ? (
                        <div>
                          <p className="font-medium">{property.landlord.name}</p>
                          <p className="text-xs text-slate-500">{property.landlord.email}</p>
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredProperties.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">No properties found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Rentals Tab */}
      {activeTab === "rentals" && (
        <section className="card mt-6 overflow-hidden">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center">
            <h2 className="font-bold">All Rental Requests</h2>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                className="input pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search rentals..."
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Tenant</th>
                  <th className="p-4">Property</th>
                  <th className="p-4">Move-in</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRentals.map((rental) => (
                  <tr key={rental.id} className="border-t border-slate-100">
                    <td className="p-4">
                      <span className="font-mono text-xs">{rental.id.slice(0, 8)}</span>
                    </td>
                    <td className="p-4">
                      {rental.tenant ? (
                        <div>
                          <p className="font-medium">{rental.tenant.name}</p>
                          <p className="text-xs text-slate-500">{rental.tenant.email}</p>
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      {rental.property ? (
                        <div>
                          <p className="font-medium">{rental.property.title}</p>
                          <p className="text-xs text-slate-500">{rental.property.city}</p>
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      {rental.moveInDate ? new Date(rental.moveInDate).toLocaleDateString() : "-"}
                    </td>
                    <td className="p-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        rental.status === "PENDING" ? "bg-yellow-50 text-yellow-700" :
                        rental.status === "APPROVED" ? "bg-blue-50 text-blue-700" :
                        rental.status === "COMPLETED" ? "bg-emerald-50 text-emerald-700" :
                        "bg-red-50 text-red-700"
                      }`}>
                        {rental.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredRentals.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">No rental requests found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
