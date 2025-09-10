import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Only run middleware on /boards/ routes
  if (request.nextUrl.pathname.startsWith("/boards/")) {
    // Add any lightweight middleware logic here
    // For example, you could add headers, redirects, or authentication checks

    // Add a custom header to identify board routes
    const response = NextResponse.next();
    response.headers.set("x-board-route", "true");

    return response;
  }

  // Continue with the request
  return NextResponse.next();
}

// Configure which routes this middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Only match /boards/ routes
     */
    "/boards/:path*",
  ],
};
