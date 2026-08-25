import { apiFetch } from "./client";
import type { ApiResponse, User } from "@/lib/types";
interface LoginData {
  accessToken: string;
  user: User;
}
export function login(payload: { email: string; password: string }) {
  return apiFetch<ApiResponse<LoginData>>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
export function register(payload: {
  name: string;
  email: string;
  password: string;
  role: string;
}) {
  return apiFetch<ApiResponse<User>>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
