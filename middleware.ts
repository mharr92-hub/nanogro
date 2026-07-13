import { NextRequest, NextResponse } from "next/server";
import { internalPathFromLocalized, isLocale, localeCookie, localeFromAcceptLanguage } from "@/lib/i18n-shared";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { locale, internalPath } = internalPathFromLocalized(pathname);
  const cookieLocale = request.cookies.get(localeCookie)?.value;
  const resolvedLocale = locale ?? (isLocale(cookieLocale) ? cookieLocale : localeFromAcceptLanguage(request.headers.get("accept-language")));
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nano-gro-locale", resolvedLocale);

  const targetUrl = request.nextUrl.clone();
  targetUrl.pathname = internalPath;

  let response: NextResponse;
  if (locale) {
    response = NextResponse.rewrite(targetUrl, { request: { headers: requestHeaders } });
  } else {
    response = NextResponse.next({ request: { headers: requestHeaders } });
  }
  response.cookies.set(localeCookie, resolvedLocale, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365
  });

  if (!internalPath.startsWith("/admin")) return response;
  if (internalPath === "/admin/login") return response;
  if (request.cookies.get("nano_gro_admin")?.value === "1") return response;
  return NextResponse.redirect(new URL(locale ? `/${resolvedLocale}/admin/login` : "/admin/login", request.url));
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"]
};
