import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";

// Lightweight config for Edge middleware — no database imports
export const authConfig: NextAuthConfig = {
  providers: [
    Google,
    ...(process.env.AUTH_GITHUB_ID ? [GitHub] : []),
  ],
  pages: { signIn: "/login" },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const writeRoutes = ["/posts/new", "/posts/"];
      const isWriteRoute = writeRoutes.some(
        (r) => nextUrl.pathname.startsWith(r) && nextUrl.pathname !== "/"
      );
      if (isWriteRoute && !isLoggedIn) return false;
      return true;
    },
  },
};
