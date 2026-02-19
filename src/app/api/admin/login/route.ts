import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    
    // Get admin password from server-side environment variable
    const adminPassword = process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin";

    // Verify password
    if (password !== adminPassword) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }
    
    // Create response with admin token cookie
    const response = NextResponse.json({ success: true });
    
    // Set secure HTTP-only cookie (can't be accessed by client-side JavaScript)
    response.cookies.set({
      name: "admin_token",
      value: "authenticated",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    });
    
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
