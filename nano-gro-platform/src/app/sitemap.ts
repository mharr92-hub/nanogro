import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { locales } from "@/lib/i18n/config";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// Segmented, multilingual sitemap. Every URL carries hreflang alternates so search
// engines connect the en/es variants. Wrapped so build never fails without a DB.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = ["", "/case-studies", "/diagnostic", "/results", "/distributors", "/contact"];

  const entries: MetadataRoute.Sitemap = [];

  const pushLocalized = (path: string, lastModified?: Date) => {
    for (const l of locales) {
      entries.push({
        url: `${SITE}/${l}${path}`,
        lastModified,
        alternates: {
          languages: Object.fromEntries(locales.map((x) => [x, `${SITE}/${x}${path}`])),
        },
      });
    }
  };

  for (const p of staticPaths) pushLocalized(p);

  try {
    const [cases, crops, countries, problems] = await Promise.all([
      prisma.case.findMany({ where: { publicationStatus: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
      prisma.crop.findMany({ where: { cases: { some: { publicationStatus: "PUBLISHED" } } }, select: { slug: true } }),
      prisma.country.findMany({ where: { cases: { some: { publicationStatus: "PUBLISHED" } } }, select: { slug: true } }),
      prisma.problem.findMany({ where: { cases: { some: { publicationStatus: "PUBLISHED" } } }, select: { slug: true } }),
    ]);
    for (const c of cases) pushLocalized(`/case-studies/${c.slug}`, c.updatedAt);
    for (const c of crops) pushLocalized(`/crops/${c.slug}`);
    for (const c of countries) pushLocalized(`/countries/${c.slug}`);
    for (const p of problems) pushLocalized(`/problems/${p.slug}`);
  } catch {
    // DB unavailable at build — static paths still emitted.
  }

  return entries;
}
