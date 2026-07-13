import en from "@/messages/en.json";

export type Locale = "en" | "es";
export type Messages = typeof en;

export const locales: Locale[] = ["en", "es"];
export const localeCookie = "nano_gro_lang";

/**
 * Espanol por defecto. El publico de la plataforma es la agricultura latinoamericana:
 * el ingles es la excepcion, y se sirve solo cuando el usuario lo pide explicitamente
 * (prefijo /en/... o el selector de idioma).
 */
export const defaultLocale: Locale = "es";

export function isLocale(value?: string | null): value is Locale {
  return value === "en" || value === "es";
}

export function formatMessage(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce((text, [key, value]) => text.replaceAll(`{${key}}`, String(value)), template);
}

/**
 * Mapa de slugs localizados. La ruta interna (la que existe en app/) siempre esta en
 * ingles; el usuario ve la version de su idioma. `internalPathFromLocalized` es su inversa
 * y las dos deben moverse juntas: si anades una ruta aqui, anade su entrada alli.
 */
const esSegments: Record<string, string> = {
  cases: "casos",
  problems: "problemas",
  crops: "cultivos",
  countries: "paises",
  results: "resultados",
  "roi-calculator": "calculadora-roi",
  "before-after": "antes-despues",
  compare: "comparar",
  diagnostico: "diagnostico",
  fichas: "fichas"
};

export function localizedHref(locale: Locale, path: string) {
  const clean = path === "/" ? "" : path;
  if (clean === "") return locale === "en" ? "/en" : "/es";

  const [, section = "", ...tail] = clean.split("/");
  const [sectionName, query = ""] = splitQuery(section);
  const tailPath = tail.length ? `/${tail.join("/")}` : "";

  if (locale === "en") {
    const enSection = sectionName === "diagnostico" ? "diagnostic" : sectionName;
    return `/en/${enSection}${query}${tailPath}`;
  }
  const esSection = esSegments[sectionName] ?? sectionName;
  return `/es/${esSection}${query}${tailPath}`;
}

function splitQuery(segment: string): [string, string] {
  const index = segment.indexOf("?");
  if (index === -1) return [segment, ""];
  return [segment.slice(0, index), segment.slice(index)];
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
      resultados: "results",
      "calculadora-roi": "roi-calculator",
      "antes-despues": "before-after",
      comparar: "compare",
      diagnostico: "diagnostico"
    };
    return { locale, internalPath: `/${map[section] ?? section}${tailPath}` };
  }
  const enMap: Record<string, string> = { diagnostic: "diagnostico" };
  return { locale, internalPath: `/${enMap[section] ?? section}${tailPath}` };
}
