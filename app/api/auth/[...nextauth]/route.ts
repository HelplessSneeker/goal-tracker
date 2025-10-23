import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Redirect to /goals after successful sign in
      if (url === baseUrl || url === "/") {
        return `${baseUrl}/goals`;
      }
      // If callback URL is provided, use it
      if (url.startsWith(baseUrl)) {
        return url;
      }
      return baseUrl;
    },
  },
});

export { handler as GET, handler as POST };
