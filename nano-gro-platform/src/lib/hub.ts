import { prisma } from "./db";
import { caseCardSelect } from "./search";
import type { Prisma } from "@prisma/client";

// Shared data loader for programmatic hub pages (crops / countries / problems).
export async function getHubData(where: Prisma.CaseWhereInput) {
  const published: Prisma.CaseWhereInput = { ...where, publicationStatus: "PUBLISHED" };
  const [count, agg, cases] = await Promise.all([
    prisma.case.count({ where: published }),
    prisma.case.aggregate({ where: published, _avg: { yieldIncreasePct: true, roiPct: true } }),
    prisma.case.findMany({
      where: published,
      orderBy: [{ featured: "desc" }, { confidenceScore: "desc" }],
      take: 12,
      select: caseCardSelect,
    }),
  ]);
  return {
    count,
    avgYield: agg._avg.yieldIncreasePct,
    avgRoi: agg._avg.roiPct,
    cases,
  };
}
