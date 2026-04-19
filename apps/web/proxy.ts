import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const canonicalHost = getCanonicalHost();
  const currentHost = request.headers.get("host");

  if (canonicalHost && currentHost && currentHost !== canonicalHost && currentHost.endsWith(".vercel.app")) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.host = canonicalHost;

    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

function getCanonicalHost() {
  const appUrl = process.env.AUTH_URL || process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) return "";

  try {
    const normalized = appUrl.startsWith("http://") || appUrl.startsWith("https://") ? appUrl : `https://${appUrl}`;
    return new URL(normalized).host;
  } catch {
    return "";
  }
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)"
  ]
};
