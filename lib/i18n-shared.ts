import en from "@/messages/en.json";

export type Locale = "en" | "es";
export type Messages = typeof en;

export const locales: Locale[] = ["en", "es"];
export const localeCookie = "nano_gro_lang";

export function isLocale(value?: string | null): value is Locale {
  return value === "en" || value === "es";
}

export function localeFromAcceptLanguage(value?: string | null): Locale {
  const first = value?.split(",").map((item) => item.trim().slice(0, 2).toLowerCase()).find(Boolean);
  if (first === "en") return "en";
  return "es";
}

export function formatMessage(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce((text, [key, value]) => text.replaceAll(`{${key}}`, String(value)), template);
}

export function localizedHref(locale: Locale, path: string) {
  const clean = path === "/" ? "" : path;
  if (locale === "en") {
    if (clean === "") return "/en";
    if (clean === "/diagnostico") return "/en/diagnostic";
    return `/en${clean}`;
  }
  if (clean === "") return "/es";
  if (clean.startsWith("/cases/")) return clean.replace("/cases/", "/es/casos/");
  if (clean.startsWith("/problems/")) return clean.replace("/problems/", "/es/problemas/");
  if (clean.startsWith("/crops/")) return clean.replace("/crops/", "/es/cultivos/");
  if (clean.startsWith("/countries/")) return clean.replace("/countries/", "/es/paises/");
  if (clean === "/cases") return "/es/casos";
  if (clean === "/problems") return "/es/problemas";
  if (clean === "/crops") return "/es/cultivos";
  if (clean === "/countries") return "/es/paises";
  if (clean === "/diagnostico") return "/es/diagnostico";
  return `/es${clean}`;
}

export function internalPathFromLocalized(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  const locale = isLocale(parts[0]) ? parts[0] : null;
  if (!locale) return { locale: null, internalPath: pathname };
  const rest = parts.slice(1);
  if (rest.length === 0) return { locale, internalPath: "/" };
  const [section, ...tail] = rest;
  const tailPath = tail.length ? `/${tail.join("/")}` : "";
  if (locale === "es") {
    const map: Record<string, string> = {
      casos: "cases",
      problemas: "problems",
      cultivos: "crops",
      paises: "countries",
      diagnostico: "diagnostico"
    };
    return { locale, internalPath: `/${map[section] ?? section}${tailPath}` };
  }
  const enMap: Record<string, string> = { diagnostic: "diagnostico" };
  return { locale, internalPath: `/${enMap[section] ?? section}${tailPath}` };
}
