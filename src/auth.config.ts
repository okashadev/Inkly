// auth.config.ts
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      const isProtectedRoute = pathname.startsWith("/user");

      if (isProtectedRoute) {
        if (isLoggedIn) return true;

        const loginUrl = new URL("/login", nextUrl.origin);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return Response.redirect(loginUrl);
      }

      const isAuthRoute =
        pathname.startsWith("/login") || pathname.startsWith("/register");

      if (isAuthRoute) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/user/dashboard", nextUrl.origin));
        }
        return true;
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
