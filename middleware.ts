import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get("host") ?? "";

  const hostname = host.split(":")[0];
  const subdomain = hostname.split(".")[0];

  // If visiting app.domain.com
  if (subdomain === "app") {
    // Avoid infinite rewrite
    console.log(url.pathname);
    if (!url.pathname.startsWith("/admin")) {
      url.pathname = `/admin${url.pathname}`;
      // url.pathname = `/admin/overview`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
