"use client";

import { useState } from "react";
import { CreditCard, LockKeyhole } from "lucide-react";
import { toast } from "sonner";
import { createPayment } from "@/lib/api/payments";

export function PaymentPage({ rentalId }: { rentalId: string }) {
  const [loading, setLoading] = useState(false);

  async function pay() {
    setLoading(true);
    try {
      const response = await createPayment(rentalId);
      if (response.data.checkoutUrl) {
        window.location.href = response.data.checkoutUrl;
      } else {
        window.location.href = `/payment/success?payment_id=${response.data.sessionId || ""}`;
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not start payment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-10">
      <div className="card w-full max-w-lg p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700"><CreditCard /></div>
        <h1 className="mt-5 text-2xl font-bold">Secure rental payment</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">You are about to start the payment for rental request #{rentalId}. Your backend should return a Stripe Checkout or SSLCommerz URL.</p>
        <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-600"><LockKeyhole className="mr-2 inline h-4 w-4" /> Payment details are handled by the gateway.</div>
        <button onClick={pay} disabled={loading} className="btn-primary mt-6 w-full">{loading ? "Redirecting..." : "Proceed to payment"}</button>
      </div>
    </div>
  );
}
