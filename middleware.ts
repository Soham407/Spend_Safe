import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // 1. Define Public Routes (accessible without auth)
  const isPublicRoute =
    path === "/" || // Landing page
    path === "/login" ||
    path === "/signup" ||
    path === "/pricing" ||
    path === "/demo" ||
    path === "/terms" ||
    path === "/privacy" ||
    path.startsWith("/auth/") ||
    path.startsWith("/api/public") ||
    path.startsWith("/_next") ||
    path.startsWith("/static") ||
    path.includes("."); // Assets

  // 2. Define Protected Routes (require auth)
  // Everything starting with /dashboard is protected
  // You might also want to protect /api routes that aren't public
  const isProtectedRoute =
    path.startsWith("/dashboard") ||
    (path.startsWith("/api") && !path.startsWith("/api/public"));

  // 3. Handle Unauthorized Access
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    const redirectResponse = NextResponse.redirect(url);

    // Copy cookies to ensure session sync
    const cookies = supabaseResponse.cookies.getAll();
    cookies.forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
    });

    return redirectResponse;
  }

  // 4. Handle Authenticated User Access
  if (user) {
    // Redirect authenticated users away from public marketing/auth pages to dashboard
    // We allow them to view Terms/Privacy/Pricing likely, but definitely not Login/Signup/Landing
    if (path === "/login" || path === "/signup" || path === "/") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      const redirectResponse = NextResponse.redirect(url);

      // Copy cookies to ensure session sync
      const cookies = supabaseResponse.cookies.getAll();
      cookies.forEach((cookie) => {
        redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
      });

      return redirectResponse;
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
