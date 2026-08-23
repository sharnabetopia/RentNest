import Link from "next/link";
import { XCircle } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center">
      <div className="card max-w-lg p-10 text-center">
        <XCircle className="mx-auto h-16 w-16 text-red-500" />
        <h1 className="mt-5 text-2xl font-bold">Payment cancelled</h1>
        <p className="mt-2 text-slate-500">No payment was completed. You can return to your tenant dashboard and try again.</p>
        <Link href="/dashboard/tenant" className="btn-primary mt-6">Back to dashboard</Link>
      </div>
    </div>
  );
}
