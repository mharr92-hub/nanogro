import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, internalPathFromLocalized, isLocale, localeCookie } from "@/lib/i18n-shared";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { locale, internalPath } = internalPathFromLocalized(pathname);
  const cookieLocale = request.cookies.get(localeCookie)?.value;
  /*
   * El idioma por defecto es el espanol, no el del navegador.
   * El publico de la plataforma es agricultura latinoamericana; antes se leia
   * Accept-Language y un navegador configurado en ingles recibia el sitio en ingles.
   * Ahora manda, por este orden: el prefijo de la URL (/en/...), la eleccion guardada
   * del usuario, y si no hay ninguna de las dos, espanol.
   */
  const resolvedLocale = locale ?? (isLocale(cookieLocale) ? cookieLocale : defaultLocale);
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
