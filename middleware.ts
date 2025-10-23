import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // If user is authenticated and trying to access auth pages, redirect to /goals
    if (req.nextUrl.pathname.startsWith("/auth")) {
      return NextResponse.redirect(new URL("/goals", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to auth pages without token
        if (req.nextUrl.pathname.startsWith("/auth")) {
          return true;
        }
        // Require token for all other pages
        return !!token;
      },
    },
    pages: {
      signIn: "/auth/signin",
    },
  }
);

// Protect all routes except /auth/* and static files
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - /auth/* (auth pages)
     * - /api/auth/* (NextAuth API routes)
     * - /_next/* (Next.js internals)
     * - /static/* (static files)
     * - /favicon.ico, /robots.txt, etc. (public files)
     */
    "/((?!api/auth|_next|static|favicon.ico|robots.txt).*)",
  ],
};
