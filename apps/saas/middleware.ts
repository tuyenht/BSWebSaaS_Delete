import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 80;

type RateLimitEntry = {
  count: number;
  expiresAt: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

function applySecurityHeaders(response: NextResponse) {
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "connect-src 'self' https:",
      "font-src 'self' data:",
      "frame-ancestors 'none'",
      "form-action 'self'",
    ].join("; "),
  );
  response.headers.set("Referrer-Policy", "no-referrer");
  response.headers.set("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "0");
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || entry.expiresAt < now) {
    rateLimitStore.set(ip, { count: 1, expiresAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  entry.count += 1;
  return false;
}

export function middleware(request: NextRequest) {
  const ip =
    request.ip ??
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  if (request.nextUrl.pathname.startsWith("/api")) {
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "RATE_LIMIT_EXCEEDED" },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil(RATE_LIMIT_WINDOW_MS / 1000)),
          },
        },
      );
    }
  }

  const response = NextResponse.next();
  applySecurityHeaders(response);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt).*)"],
};


