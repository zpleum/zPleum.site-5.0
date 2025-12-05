import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ข้าม static, js, css, api, favicon
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.match(/\.(js|css|png|jpg|svg|ico|json)$/)
  ) {
    return NextResponse.next();
  }

  const hostname = request.headers.get("host") || "";
  console.log("Middleware triggered, hostname:", hostname);

  const cleanHost = hostname.split(":")[0];
  const subdomain = cleanHost.split(".")[0];
  const isMainSite =
    cleanHost === "localhost" ||
    cleanHost === "zpleum.site" ||
    cleanHost === "www.zpleum.site";

  if (!isMainSite) {
    console.log("Rewriting to /edge because subdomain:", subdomain);
    const url = request.nextUrl.clone();
    url.pathname = "/edge";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}
