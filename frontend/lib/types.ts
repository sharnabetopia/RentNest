export type Role = "TENANT" | "LANDLORD" | "ADMIN";
export interface User { id:string; name:string; email:string; role:Role; status?:string; phone?:string|null; image?:string|null; }
export interface Category { id:string; name:string; }
export interface Property { id:string; title:string; description:string; address:string; city:string; rent:number|string; bedrooms:number; bathrooms:number; amenities:string[]; images:string[]; status:string; landlordId?:string; categoryId?:string; category?:Category; landlord?:User; reviews?:Review[]; }
export interface Rental { id:string; status:string; moveInDate:string; duration:number; message?:string|null; property?:Property; tenant?:User; payment?:Payment|null; }
export interface Payment { id:string; amount:number|string; provider:string; status:string; transactionId?:string|null; rentalRequestId?:string; }
export interface Review { id:string; rating:number; comment:string; }
export interface ApiResponse<T> { success:boolean; message?:string; data:T; }
export interface PropertyFilters { searchTerm?:string; city?:string; minPrice?:number; maxPrice?:number; categoryId?:string; }
