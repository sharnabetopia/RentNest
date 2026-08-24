"use client";

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { getLandlordRequests, updateLandlordRequest } from "@/lib/api/landlord";
import type { Rental } from "@/lib/types";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function RequestManagement() {
  const [requests, setRequests] = useState<Rental[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  useEffect(() => { getLandlordRequests().then((r) => setRequests(r.data)).catch(() => toast.error("Could not load requests.")); }, []);

  async function update(id: number, status: "APPROVED" | "REJECTED") {
    setLoadingId(id);
    try {
      await updateLandlordRequest(String(id), status);
      setRequests((current) => current.map((r) => Number(r.id) === id ? { ...r, status } : r));
      toast.success(status === "APPROVED" ? "Request approved." : "Request rejected.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update request.");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="container-page py-10">
      <div className="mb-7"><p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Landlord</p><h1 className="page-title mt-1">Rental requests</h1></div>
      <div className="card overflow-hidden">
        {requests.length ? requests.map((request) => <div key={request.id} className="flex flex-col gap-4 border-b border-slate-100 p-5 last:border-0 lg:flex-row lg:items-center lg:justify-between"><div><p className="font-semibold">{request.property?.title || `Request #${request.id}`}</p><p className="mt-1 text-sm text-slate-500">{request.tenant?.name || "Tenant"} · {request.tenant?.email || ""}</p><p className="mt-2 text-sm text-slate-600">{request.message || "No message provided."}</p></div><div className="flex items-center gap-3"><StatusBadge status={request.status} />{request.status === "PENDING" && <><button disabled={loadingId === Number(request.id)} onClick={() => update(Number(request.id), "APPROVED")} className="btn-primary"><Check className="mr-1 h-4 w-4" /> Approve</button><button disabled={loadingId === Number(request.id)} onClick={() => update(Number(request.id), "REJECTED")} className="btn-secondary text-red-600"><X className="mr-1 h-4 w-4" /> Reject</button></>}</div></div>) : <div className="p-12 text-center text-sm text-slate-500">No incoming requests.</div>}
      </div>
    </div>
  );
}
