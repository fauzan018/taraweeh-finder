import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  // Check if the request is for admin routes (except login)
  if (req.nextUrl.pathname.startsWith("/admin") && !req.nextUrl.pathname.startsWith("/admin/login")) {
    const adminCookie = req.cookies.get("admin_token")?.value;
    
    // If the auth token is missing or invalid, redirect to login
    if (adminCookie !== "authenticated") {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
