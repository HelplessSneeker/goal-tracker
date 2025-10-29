import { withAuth } from "next-auth/middleware";

// NextAuth middleware for route protection
// Note: next-intl is configured with localePrefix: "never" so no middleware needed for i18n
export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      // Allow access to auth pages without token
      if (req.nextUrl.pathname.startsWith("/auth")) {
        return true;
      }
      // Allow API routes (they handle their own auth if needed)
      if (req.nextUrl.pathname.startsWith("/api")) {
        return true;
      }
      // Require token for all other pages
      return !!token;
    },
  },
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request",
    error: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

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
