import type { MetadataRoute } from "next";
import { getPublishedCases, getTaxonomy } from "@/lib/data";
import { localizedHref, locales } from "@/lib/i18n-shared";

/**
 * Sitemap dinamico con hreflang.
 *
 * Se genera a partir de `localizedHref`, la misma funcion que usan los enlaces del sitio:
 * asi el sitemap no puede desincronizarse del mapa de rutas localizadas. Incluye las
 * paginas de SEO programatico de dos niveles, pero SOLO las combinaciones que de verdad
 * tienen casos publicados: una URL vacia indexada es una pagina que Google penaliza.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const [cases, taxonomy] = await Promise.all([getPublishedCases(), getTaxonomy()]);

  const staticPaths = [
    "/",
    "/cases",
    "/problems",
    "/crops",
    "/countries",
    "/before-after",
    "/roi-calculator",
    "/diagnostico",
    "/fichas"
  ];

  const casePaths = cases.map((item) => `/cases/${item.slug}`);
  const problemPaths = taxonomy.problems.map((item) => `/problems/${item.slug}`);
  const cropPaths = taxonomy.crops.map((item) => `/crops/${item.slug}`);
  const countryPaths = taxonomy.countries.map((item) => `/countries/${item.slug}`);

  // Combinaciones reales, deducidas de los casos publicados.
  const comboPaths = new Set<string>();
  for (const item of cases) {
    if (item.crop?.slug && item.primary_problem?.slug) {
      comboPaths.add(`/crops/${item.crop.slug}/${item.primary_problem.slug}`);
    }
    if (item.country?.slug && item.crop?.slug) {
      comboPaths.add(`/countries/${item.country.slug}/${item.crop.slug}`);
    }
  }

  const paths = [
    ...staticPaths,
    ...casePaths,
    ...problemPaths,
    ...cropPaths,
    ...countryPaths,
    ...comboPaths
  ];

  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${site}${localizedHref(locale, path)}`,
      lastModified: new Date(),
      alternates: {
        languages: Object.fromEntries(
          locales.map((alternate) => [alternate, `${site}${localizedHref(alternate, path)}`])
        )
      }
    }))
  );
}
