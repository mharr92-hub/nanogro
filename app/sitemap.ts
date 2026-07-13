import type { MetadataRoute } from "next";
import { getPublishedCases, getTaxonomy } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const [cases, taxonomy] = await Promise.all([getPublishedCases(), getTaxonomy()]);
  const paths = [
    "/en", "/en/cases", "/en/problems", "/en/crops", "/en/countries", "/en/diagnostic",
    "/es", "/es/casos", "/es/problemas", "/es/cultivos", "/es/paises", "/es/diagnostico",
    ...cases.flatMap((item) => [`/en/cases/${item.slug}`, `/es/casos/${item.slug}`]),
    ...taxonomy.problems.flatMap((item) => [`/en/problems/${item.slug}`, `/es/problemas/${item.slug}`]),
    ...taxonomy.crops.flatMap((item) => [`/en/crops/${item.slug}`, `/es/cultivos/${item.slug}`]),
    ...taxonomy.countries.flatMap((item) => [`/en/countries/${item.slug}`, `/es/paises/${item.slug}`])
  ];
  return paths.map((path) => ({
    url: `${site}${path}`,
    lastModified: new Date()
  }));
}
