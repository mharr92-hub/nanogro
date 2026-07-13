import type { Locale } from "./i18n/config";

// Build a locale-prefixed path, e.g. href("es", "/case-studies") -> "/es/case-studies".
export function href(locale: Locale, path = ""): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${clean === "/" ? "" : clean}`;
}
