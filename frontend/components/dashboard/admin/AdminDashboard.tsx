"use client";

import { useEffect, useMemo, useState } from "react";
import { Ban, Building2, Search, ShieldCheck, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { getAdminUsers, updateAdminUser } from "@/lib/api/admin";
import type { User } from "@/lib/types";

export function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => { getAdminUsers().then((r) => setUsers(r.data)).catch(() => toast.error("Could not load users.")); }, []);

  const filtered = useMemo(() => users.filter((u) => `${u.name} ${u.email}`.toLowerCase().includes(search.toLowerCase())), [users, search]);

  async function toggle(user: User) {
    try {
      const next = user.status === "BANNED" ? "ACTIVE" : "BANNED";
      await updateAdminUser(String(user.id), next);
      setUsers((current) => current.map((x) => x.id === user.id ? { ...x, status: next } : x));
      toast.success(next === "BANNED" ? "User banned." : "User unbanned.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update user.");
    }
  }

  return (
    <div className="container-page py-10">
      <div className="mb-8"><p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Administration</p><h1 className="page-title mt-1">Platform overview</h1><p className="mt-2 text-slate-500">Monitor users and marketplace activity.</p></div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {( [
          [Users, "Total users", users.length],
          [Building2, "Properties", "API"],
          [ShieldCheck, "Pending moderation", "API"],
          [Ban, "Banned users", users.filter((x) => x.status === "BANNED").length],
        ] as Array<[LucideIcon, string, string | number]>).map(([Icon, label, value]) => <div key={label} className="card p-5"><Icon className="h-5 w-5 text-brand-600" /><p className="mt-4 text-2xl font-bold">{value}</p><p className="text-sm text-slate-500">{label}</p></div>)}
      </div>

      <section className="card mt-8 overflow-hidden">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center"><h2 className="font-bold">User management</h2><div className="relative w-full sm:w-80"><Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><input className="input pl-9" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." /></div></div>
        <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-500"><tr><th className="p-4">User</th><th className="p-4">Role</th><th className="p-4">Status</th><th className="p-4">Action</th></tr></thead><tbody>{filtered.map((user) => <tr key={user.id} className="border-t border-slate-100"><td className="p-4"><p className="font-semibold">{user.name}</p><p className="text-xs text-slate-500">{user.email}</p></td><td className="p-4">{user.role}</td><td className="p-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${user.status === "BANNED" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>{user.status}</span></td><td className="p-4"><button onClick={() => toggle(user)} className="btn-secondary">{user.status === "BANNED" ? "Unban" : "Ban"}</button></td></tr>)}</tbody></table></div>
      </section>
    </div>
  );
}
