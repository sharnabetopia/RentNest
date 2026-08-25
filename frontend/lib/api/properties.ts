import { apiFetch } from "./client";
import type {
  ApiResponse,
  Category,
  Property,
  PropertyFilters,
} from "@/lib/types";
export function getProperties(filters: PropertyFilters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== "") params.set(k, String(v));
  });
  return apiFetch<ApiResponse<Property[]>>(
    `/properties${params.toString() ? `?${params}` : ""}`,
  );
}
export function getProperty(id: string) {
  return apiFetch<ApiResponse<Property>>(`/properties/${id}`);
}
export function getCategories() {
  return apiFetch<ApiResponse<Category[]>>("/categories");
}
