"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CreditCard, Home, MessageSquareText, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getMyRentals } from "@/lib/api/rentals";
import { getPayments } from "@/lib/api/payments";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PageSkeleton } from "@/components/ui/PageSkeleton";
import { ReviewModal } from "@/components/dashboard/tenant/ReviewModal";
import type { Payment, Rental } from "@/lib/types";

export function TenantDashboard() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState<{ isOpen: boolean; rentalId: string; property: NonNullable<Rental["property"]> } | null>(null);

  useEffect(() => {
    Promise.all([getMyRentals(), getPayments()])
      .then(([r, p]) => {
        setRentals(r.data);
        setPayments(p.data);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <PageSkeleton />;
  }

  const approved = rentals.filter((x) => x.status === "APPROVED");

  return (
    <div className="container-page py-10">
      <div className="mb-8"><p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Tenant dashboard</p><h1 className="page-title mt-1">Welcome back</h1><p className="mt-2 text-slate-500">Track your rental journey from one place.</p></div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {([
          [Home, "Requests", rentals.length],
          [CreditCard, "Approved", approved.length],
          [Wallet, "Payments", payments.length],
          [MessageSquareText, "Active rentals", rentals.filter((x) => x.status === "ACTIVE").length]
        ] as [LucideIcon, string, number][]).map(([Icon, label, value]) => <div key={label} className="card p-5"><Icon className="h-5 w-5 text-brand-600" /><p className="mt-4 text-2xl font-bold">{value}</p><p className="text-sm text-slate-500">{label}</p></div>)}
      </div>

      <section className="card mt-8 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 p-5"><h2 className="font-bold">Rental requests</h2><Link href="/properties" className="text-sm font-semibold text-brand-700">Browse homes</Link></div>
        {rentals.length ? rentals.map((rental) => (
          <div key={rental.id} className="flex flex-col gap-4 border-b border-slate-100 p-5 last:border-0 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="font-semibold">{rental.property?.title || `Rental #${rental.id}`}</p><p className="mt-1 text-sm text-slate-500">Property</p></div>
            <div className="flex items-center gap-3">
              <StatusBadge status={rental.status} />
              {rental.status === "APPROVED" && (
                <Link href={`/dashboard/tenant/requests/${rental.id}/pay`} className="btn-primary">Pay now</Link>
              )}
              {rental.status === "COMPLETED" && rental.property && (
                <button
                  onClick={() => setReviewModal({ isOpen: true, rentalId: rental.id, property: rental.property! })}
                  className="btn-primary"
                >
                  Leave review
                </button>
              )}
            </div>
          </div>
        )) : <div className="p-10 text-center text-sm text-slate-500">No rental requests yet.</div>}
      </section>

      <section className="card mt-8 overflow-hidden">
        <div className="border-b border-slate-200 p-5"><h2 className="font-bold">Payment history</h2></div>
        {payments.length ? <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-500"><tr><th className="p-4">Payment</th><th className="p-4">Amount</th><th className="p-4">Provider</th><th className="p-4">Status</th></tr></thead><tbody>{payments.map((payment) => <tr key={payment.id} className="border-t border-slate-100"><td className="p-4">#{payment.id}</td><td className="p-4 font-semibold">${payment.amount}</td><td className="p-4">{payment.provider}</td><td className="p-4"><StatusBadge status={payment.status} /></td></tr>)}</tbody></table></div> : <div className="p-10 text-center text-sm text-slate-500">No payment history.</div>}
      </section>

      <ReviewModal
        property={reviewModal?.property || {} as NonNullable<Rental["property"]>}
        rentalId={reviewModal?.rentalId || ""}
        isOpen={reviewModal?.isOpen || false}
        onClose={() => setReviewModal(null)}
      />
    </div>
  );
}
