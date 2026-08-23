import type { Role, User } from "./types";

const TOKEN_KEY = "rentnest_token";
const USER_KEY = "rentnest_user";

export function saveAuth(token: string, user: User) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  document.cookie = `rentnest_token=${encodeURIComponent(token)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
  document.cookie = `rentnest_role=${user.role}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  document.cookie = "rentnest_token=; path=/; max-age=0";
  document.cookie = "rentnest_role=; path=/; max-age=0";
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as User; } catch { return null; }
}

export function roleHome(role: Role) {
  if (role === "ADMIN") return "/dashboard/admin";
  if (role === "LANDLORD") return "/dashboard/landlord";
  return "/dashboard/tenant";
}
