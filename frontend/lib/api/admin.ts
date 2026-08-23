import { apiFetch } from "./client"; import type { ApiResponse,User,Property,Rental } from "@/lib/types";
export function getAdminUsers(){return apiFetch<ApiResponse<User[]>>("/admin/users");}
export function updateAdminUser(id:string,status:string){return apiFetch<ApiResponse<User>>(`/admin/users/${id}`,{method:"PATCH",body:JSON.stringify({status})});}
export function getAdminProperties(){return apiFetch<ApiResponse<Property[]>>("/admin/properties");}
export function getAdminRentals(){return apiFetch<ApiResponse<Rental[]>>("/admin/rentals");}
