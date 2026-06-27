import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session;

  const isProtectedRoute = ["/dashboard", "/hub", "/admin"].some(
    (path) => nextUrl.pathname.startsWith(path)
  );
  const isAuthRoute = ["/login", "/register", "/forgot-password", "/verify-email"].some(
    (path) => nextUrl.pathname.startsWith(path)
  );
  const isApiRoute = nextUrl.pathname.startsWith("/api");

  // Redirect unauthenticated users from protected routes
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  const isAdmin = (session?.user as any)?.role === "ADMIN" || session?.user?.email === "ridhampokiya10@gmail.com";

  // Redirect authenticated users away from auth routes
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL(isAdmin ? "/admin" : "/dashboard", nextUrl));
  }

  // Ensure admins visiting /dashboard go directly to /admin
  if (nextUrl.pathname === "/dashboard" && isAdmin) {
    return NextResponse.redirect(new URL("/admin", nextUrl));
  }

  const response = NextResponse.next();

  // Security headers
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  // CSP
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://app.lemonsqueezy.com https://assets.lemonsqueezy.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' blob: data: https://lh3.googleusercontent.com https://avatars.githubusercontent.com",
    "connect-src 'self' https://api.lemonsqueezy.com https://app.posthog.com",
    "frame-src 'self' https://app.lemonsqueezy.com",
    "object-src 'none'",
  ].join("; ");

  response.headers.set("Content-Security-Policy", csp);

  return response;
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
