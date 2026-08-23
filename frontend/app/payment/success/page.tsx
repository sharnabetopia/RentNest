import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function PaymentSuccessPage() {
  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center">
      <div className="card max-w-lg p-10 text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-brand-600" />
        <h1 className="mt-5 text-2xl font-bold">Payment successful</h1>
        <p className="mt-2 text-slate-500">Your payment was completed. You can now manage the rental from your dashboard.</p>
        <Link href="/dashboard/tenant" className="btn-primary mt-6">Go to dashboard</Link>
      </div>
    </div>
  );
}
