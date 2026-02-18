import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // Check if the request is for admin routes (except login)
  if (req.nextUrl.pathname.startsWith("/admin") && !req.nextUrl.pathname.startsWith("/admin/login")) {
    const adminCookie = req.cookies.get("admin_token")?.value;
    
    // If no admin token cookie exists, redirect to login
    if (!adminCookie) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
