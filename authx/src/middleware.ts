import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;

  // Protect all routes under /protected
  if (req.nextUrl.pathname.startsWith("/protected")) {
    if (!token) {
      const signInUrl = new URL("/sign-in", req.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

// Apply middleware only to protected routes
export const config = {
  matcher: ["/protected/:path*"],
};
