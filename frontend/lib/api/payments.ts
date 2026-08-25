import { apiFetch } from "./client";
import type { ApiResponse, Payment } from "@/lib/types";
export function createPayment(rentalRequestId: string) {
  return apiFetch<ApiResponse<{ checkoutUrl: string; sessionId: string }>>(
    "/payments/create",
    { method: "POST", body: JSON.stringify({ rentalRequestId }) },
  );
}
export function getPayments() {
  return apiFetch<ApiResponse<Payment[]>>("/payments");
}
