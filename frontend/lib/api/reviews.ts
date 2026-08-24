import { apiFetch } from "./client";
import type { ApiResponse, Review } from "@/lib/types";

export function createReview(payload: { propertyId: string; rating: number; comment?: string }) {
  return apiFetch<ApiResponse<Review>>("/reviews", { method: "POST", body: JSON.stringify(payload) });
}
