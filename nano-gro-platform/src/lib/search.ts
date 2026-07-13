import { prisma } from "./db";
import type { Prisma } from "@prisma/client";

// Faceted case search. Default path queries Postgres directly (always works).
// If MEILI_HOST is configured, publish-time sync (syncCaseToIndex) keeps a
// Meilisearch index warm for typo-tolerant search; see note in searchCases.

export interface CaseFilters {
  query?: string;
  crop?: string; // slug
  country?: string;
  climate?: string;
  soilType?: string;
  problem?: string;
  verification?: string;
  success?: string;
  language?: string;
  minYield?: number;
  minRoi?: number;
  minConfidence?: number;
  sort?: "relevance" | "confidence" | "yield" | "roi" | "recent";
  page?: number;
  pageSize?: number;
}

export const PAGE_SIZE = 12;

export function buildCaseWhere(f: CaseFilters): Prisma.CaseWhereInput {
  const where: Prisma.CaseWhereInput = { publicationStatus: "PUBLISHED" };

  if (f.crop) where.crop = { slug: f.crop };
  if (f.country) where.country = { slug: f.country };
  if (f.climate) where.climate = { slug: f.climate };
  if (f.soilType) where.soilType = { slug: f.soilType };
  if (f.problem) where.problems = { some: { slug: f.problem } };
  if (f.verification) where.verificationStatus = f.verification as Prisma.CaseWhereInput["verificationStatus"];
  if (f.success) where.successLevel = f.success as Prisma.CaseWhereInput["successLevel"];
  if (f.language) where.language = f.language as Prisma.CaseWhereInput["language"];
  if (typeof f.minYield === "number") where.yieldIncreasePct = { gte: f.minYield };
  if (typeof f.minRoi === "number") where.roiPct = { gte: f.minRoi };
  if (typeof f.minConfidence === "number") where.confidenceScore = { gte: f.minConfidence };

  if (f.query && f.query.trim()) {
    const q = f.query.trim();
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { conclusions: { contains: q, mode: "insensitive" } },
      { tags: { has: q.toLowerCase() } },
      { keywords: { has: q.toLowerCase() } },
      { crop: { is: { OR: [{ nameEn: { contains: q, mode: "insensitive" } }, { nameEs: { contains: q, mode: "insensitive" } }] } } },
      { country: { is: { OR: [{ nameEn: { contains: q, mode: "insensitive" } }, { nameEs: { contains: q, mode: "insensitive" } }] } } },
    ];
  }

  return where;
}

function orderBy(sort: CaseFilters["sort"]): Prisma.CaseOrderByWithRelationInput[] {
  switch (sort) {
    case "yield":
      return [{ yieldIncreasePct: "desc" }, { confidenceScore: "desc" }];
    case "roi":
      return [{ roiPct: "desc" }, { confidenceScore: "desc" }];
    case "recent":
      return [{ publishedAt: "desc" }];
    case "confidence":
      return [{ confidenceScore: "desc" }];
    default:
      return [{ featured: "desc" }, { confidenceScore: "desc" }, { publishedAt: "desc" }];
  }
}

export const caseCardSelect = {
  id: true,
  slug: true,
  title: true,
  language: true,
  yieldIncreasePct: true,
  roiPct: true,
  diseaseReductPct: true,
  confidenceScore: true,
  verificationStatus: true,
  successLevel: true,
  featured: true,
  crop: { select: { slug: true, nameEn: true, nameEs: true } },
  country: { select: { slug: true, nameEn: true, nameEs: true } },
  media: { where: { type: "PHOTO_AFTER" as const }, take: 1, select: { url: true } },
} satisfies Prisma.CaseSelect;

export type CaseCard = Prisma.CaseGetPayload<{ select: typeof caseCardSelect }>;

export interface SearchResult {
  cases: CaseCard[];
  total: number;
  page: number;
  pageSize: number;
  facets: {
    crops: FacetTerm[];
    countries: FacetTerm[];
    climates: FacetTerm[];
    problems: FacetTerm[];
  };
}

export interface FacetTerm {
  slug: string;
  nameEn: string;
  nameEs: string;
  count: number;
}

export async function searchCases(f: CaseFilters): Promise<SearchResult> {
  // NOTE: When MEILI_HOST is configured this is where a Meilisearch query would
  // run for typo-tolerance. The Postgres path below is the source-of-truth
  // fallback and is always correct.
  const page = Math.max(1, f.page ?? 1);
  const pageSize = f.pageSize ?? PAGE_SIZE;
  const where = buildCaseWhere(f);

  const [cases, total, facets] = await Promise.all([
    prisma.case.findMany({
      where,
      orderBy: orderBy(f.sort),
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: caseCardSelect,
    }),
    prisma.case.count({ where }),
    loadFacets(),
  ]);

  return { cases, total, page, pageSize, facets };
}

// Facet terms: taxonomy options that have at least one published case (global
// counts). Keeps the filter UI clean and avoids advertising empty filters.
async function loadFacets(): Promise<SearchResult["facets"]> {
  const published = { cases: { some: { publicationStatus: "PUBLISHED" as const } } };
  const [crops, countries, climates, problems] = await Promise.all([
    prisma.crop.findMany({
      where: published,
      select: { slug: true, nameEn: true, nameEs: true, _count: { select: { cases: { where: { publicationStatus: "PUBLISHED" } } } } },
      orderBy: { nameEn: "asc" },
    }),
    prisma.country.findMany({
      where: published,
      select: { slug: true, nameEn: true, nameEs: true, _count: { select: { cases: { where: { publicationStatus: "PUBLISHED" } } } } },
      orderBy: { nameEn: "asc" },
    }),
    prisma.climate.findMany({
      where: published,
      select: { slug: true, nameEn: true, nameEs: true, _count: { select: { cases: { where: { publicationStatus: "PUBLISHED" } } } } },
      orderBy: { nameEn: "asc" },
    }),
    prisma.problem.findMany({
      where: published,
      select: { slug: true, nameEn: true, nameEs: true, _count: { select: { cases: { where: { publicationStatus: "PUBLISHED" } } } } },
      orderBy: { nameEn: "asc" },
    }),
  ]);

  const map = (rows: Array<{ slug: string; nameEn: string; nameEs: string; _count: { cases: number } }>): FacetTerm[] =>
    rows.map((r) => ({ slug: r.slug, nameEn: r.nameEn, nameEs: r.nameEs, count: r._count.cases }));

  return { crops: map(crops), countries: map(countries), climates: map(climates), problems: map(problems) };
}

// Suggest nearest cases when a filter combo returns zero (spec §6).
export async function suggestNearest(f: CaseFilters): Promise<CaseCard[]> {
  const relaxed: CaseFilters = { crop: f.crop, country: f.country, sort: "confidence", pageSize: 4 };
  const r = await searchCases(relaxed);
  if (r.cases.length) return r.cases;
  const top = await searchCases({ sort: "confidence", pageSize: 4 });
  return top.cases;
}
