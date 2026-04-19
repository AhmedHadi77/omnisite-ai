import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/connected-sites(.*)",
  "/ai-audit(.*)",
  "/tasks(.*)",
  "/client-requests(.*)",
  "/content-assistant(.*)",
  "/settings(.*)",
  "/sites(.*)"
]);

const clerkIsConfigured = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
);

export default clerkIsConfigured
  ? clerkMiddleware(async (auth, req) => {
      const isClerkHandshake =
        req.nextUrl.searchParams.has("__clerk_handshake") ||
        req.nextUrl.searchParams.has("_clerk_handshake");

      if (req.nextUrl.pathname.startsWith("/dashboard") && !isClerkHandshake) {
        const workspaceUrl = new URL("/connected-sites", req.url);
        workspaceUrl.searchParams.set("flow", "started");
        return NextResponse.redirect(workspaceUrl);
      }

      if (isProtectedRoute(req)) {
        await auth.protect();
      }
    }, {
      signInUrl: "/sign-in",
      signUpUrl: "/sign-up"
    })
  : function proxy() {
      return NextResponse.next();
    };

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)"
  ]
};
