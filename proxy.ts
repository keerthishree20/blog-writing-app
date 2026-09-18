import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextRequest, NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

// Only the pages that write need a login. The old check matched every path
// starting with "/posts/", which also sent logged-out readers of a shared
// post link to the login page.
function isWriteRoute(pathname: string): boolean {
  return /^\/posts\/new\/?$/.test(pathname) || /^\/posts\/[^/]+\/edit\/?$/.test(pathname);
}

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!isWriteRoute(pathname)) return;

  const session = await auth();
  const isLoggedIn = !!session?.user;

  if (!isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
