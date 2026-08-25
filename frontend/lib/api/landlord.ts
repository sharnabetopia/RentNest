import { apiFetch } from "./client";
import type { ApiResponse, Property, Rental } from "@/lib/types";
export function getLandlordProperties() {
  return apiFetch<ApiResponse<Property[]>>("/landlord/properties");
}
export function getLandlordProperty(id: string) {
  return apiFetch<ApiResponse<Property>>(`/properties/${id}`);
}
export function createLandlordProperty(payload: Partial<Property>) {
  return apiFetch<ApiResponse<Property>>("/landlord/properties", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
export function updateLandlordProperty(id: string, payload: Partial<Property>) {
  return apiFetch<ApiResponse<Property>>(`/landlord/properties/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
export function getLandlordRequests() {
  return apiFetch<ApiResponse<Rental[]>>("/landlord/requests");
}
export function updateLandlordRequest(
  id: string,
  status: "APPROVED" | "REJECTED",
) {
  return apiFetch<ApiResponse<Rental>>(`/landlord/requests/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
export function deleteLandlordProperty(id: string) {
  return apiFetch<ApiResponse<Property>>(`/landlord/properties/${id}`, {
    method: "DELETE",
  });
}
