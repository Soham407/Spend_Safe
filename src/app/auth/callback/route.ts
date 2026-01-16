import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextParam = searchParams.get("next");

  // Validate and normalize the 'next' redirect parameter
  let next = "/";
  if (nextParam) {
    try {
      // Decode and parse the next param
      const decodedNext = decodeURIComponent(nextParam);

      // Only allow same-origin paths (must start with / and no scheme/host)
      if (
        decodedNext.startsWith("/") &&
        !decodedNext.includes("//") &&
        !decodedNext.includes("\\") &&
        !decodedNext.match(/^https?:/i)
      ) {
        next = decodedNext;
      } else {
        console.warn("Invalid next param, falling back to /:", nextParam);
      }
    } catch (err) {
      console.warn("Failed to decode next param:", err);
    }
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        // In development, we can trust the origin without load balancer checks
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        // Validate forwardedHost against allowlist
        const allowedHosts =
          process.env.FORWARDED_HOST_ALLOWLIST?.split(",") || [];
        const isAllowed = allowedHosts.some(
          (host) => forwardedHost === host.trim()
        );

        if (isAllowed) {
          return NextResponse.redirect(`https://${forwardedHost}${next}`);
        } else {
          console.warn(
            "Untrusted x-forwarded-host, falling back to origin:",
            forwardedHost
          );
          return NextResponse.redirect(`${origin}${next}`);
        }
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth-code-error`);
}
