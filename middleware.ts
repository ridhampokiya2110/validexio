import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const { auth } = NextAuth(authConfig);

const redis = process.env.UPSTASH_REDIS_REST_URL
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
    })
  : null;

const ratelimit = redis
  ? new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(5, "5 m"), // Max 5 login attempts per 5 minutes per IP
      analytics: false,
    })
  : null;

export default auth(async (req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session;

  const isMaintenanceRoute = nextUrl.pathname.startsWith("/maintenance");
  const isApiRoute = nextUrl.pathname.startsWith("/api");
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isAuthRoute = ["/login", "/register", "/forgot-password", "/verify-email"].some(
    (path) => nextUrl.pathname.startsWith(path)
  );

  // BRUTE FORCE PROTECTION (Rate limit logins)
  if (req.method === "POST" && nextUrl.pathname === "/api/auth/callback/credentials") {
    if (ratelimit) {
      const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
      const { success } = await ratelimit.limit(`login_attempt_${ip}`);
      if (!success) {
        // Redirect back to login with a generic error parameter to avoid giving away details
        return NextResponse.redirect(new URL("/login?error=AccessDenied", nextUrl));
      }
    }
  }

  // MAINTENANCE MODE CHECK
  if (redis) {
    try {
      const maintenanceKey = `maintenance_mode_enabled_${process.env.NODE_ENV || "development"}`;
      const maintenanceModeEnabled = await redis.get(maintenanceKey);
      const isEnabled = maintenanceModeEnabled === "true" || maintenanceModeEnabled === true;

      // If maintenance is enabled, redirect non-essential routes to /maintenance
      if (isEnabled && !isMaintenanceRoute && !isAdminRoute && !isAuthRoute && !isApiRoute) {
        return NextResponse.redirect(new URL("/maintenance", nextUrl));
      }

      // If maintenance is disabled but user is on /maintenance, redirect home
      if (!isEnabled && isMaintenanceRoute) {
        return NextResponse.redirect(new URL("/", nextUrl));
      }
    } catch (e) {
      console.error("Middleware Redis Error:", e);
    }
  }

  const isProtectedRoute = ["/dashboard", "/hub", "/admin"].some(
    (path) => nextUrl.pathname.startsWith(path)
  );

  // Redirect unauthenticated users from protected routes
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  const adminEmail = process.env.ADMIN_EMAIL || "ridhampokiya10@gmail.com";
  const isAdmin = (session?.user as any)?.role === "ADMIN" || session?.user?.email === adminEmail;

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

  // Hide admin routes from search engines
  if (isAdminRoute) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  // CSP
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://app.lemonsqueezy.com https://assets.lemonsqueezy.com https://checkout.razorpay.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' blob: data: https://lh3.googleusercontent.com https://avatars.githubusercontent.com",
    "connect-src 'self' https://api.lemonsqueezy.com https://app.posthog.com https://lumberjack-cx.razorpay.com https://api.razorpay.com",
    "frame-src 'self' https://app.lemonsqueezy.com https://api.razorpay.com https://checkout.razorpay.com",
    "object-src 'none'",
  ].join("; ");

  response.headers.set("Content-Security-Policy", csp);

  return response;
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
