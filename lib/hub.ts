import type { CaseStudy } from "@/lib/types";

/** Cuenta casos por termino de taxonomia, ordenado de mas a menos documentado. */
export function countByTerm(
  cases: CaseStudy[],
  pick: (item: CaseStudy) => { name: string; slug: string } | undefined | null
) {
  const map = new Map<string, { name: string; slug: string; count: number }>();
  for (const item of cases) {
    const term = pick(item);
    if (!term?.slug) continue;
    const existing = map.get(term.slug);
    if (existing) existing.count += 1;
    else map.set(term.slug, { name: term.name, slug: term.slug, count: 1 });
  }
  return [...map.values()].sort((a, b) => b.count - a.count);
}
