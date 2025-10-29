import { DefaultSession } from "next-auth";

/**
 * Module augmentation for NextAuth types
 * Extends the default session and JWT types to include user ID
 */
declare module "next-auth" {
  /**
   * Extends the built-in session.user type
   */
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }

  /**
   * Extends the built-in user type
   */
  interface User {
    id: string;
  }
}

declare module "next-auth/jwt" {
  /**
   * Extends the built-in JWT type
   */
  interface JWT {
    id: string;
  }
}
