import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/admin") && !req.nextUrl.pathname.startsWith("/admin/login")) {
    const isAdmin = req.cookies.get("admin")?.value || req.headers.get("x-admin") || req.nextUrl.searchParams.get("admin");
    if (!isAdmin && typeof window !== "undefined" && !localStorage.getItem("admin")) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
