import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
  "/dashboard/tenant",
  "/dashboard/landlord",
  "/dashboard/admin",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("rentnest_token")?.value;
  const role = request.cookies.get("rentnest_role")?.value;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  if (!isProtected) return NextResponse.next();

  if (!token || !role) {
    return NextResponse.redirect(
      new URL(`/auth/login?next=${encodeURIComponent(pathname)}`, request.url),
    );
  }

  if (pathname.startsWith("/dashboard/admin") && role !== "ADMIN") {
    return NextResponse.redirect(
      new URL(`/dashboard/${role.toLowerCase()}`, request.url),
    );
  }

  if (
    pathname.startsWith("/dashboard/landlord") &&
    role !== "LANDLORD" &&
    role !== "ADMIN"
  ) {
    return NextResponse.redirect(new URL("/dashboard/tenant", request.url));
  }

  if (
    pathname.startsWith("/dashboard/tenant") &&
    role !== "TENANT" &&
    role !== "ADMIN"
  ) {
    return NextResponse.redirect(new URL("/dashboard/landlord", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
