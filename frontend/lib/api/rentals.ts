import { apiFetch } from "./client"; import type { ApiResponse,Rental } from "@/lib/types";
export function createRental(payload:{propertyId:string;moveInDate:string;duration:number;message?:string}){return apiFetch<ApiResponse<Rental>>("/rentals",{method:"POST",body:JSON.stringify(payload)});}
export function getMyRentals(){return apiFetch<ApiResponse<Rental[]>>("/rentals");}
