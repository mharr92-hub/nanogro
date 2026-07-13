import type { CaseFilters, FacetCounts } from "@/components/CaseFacets";
import type { CaseStudy } from "@/lib/types";

/**
 * Filtrado, orden y contadores de facetas del listado de casos.
 *
 * Funciones puras sobre el conjunto ya publicado: la capa de datos (lib/data.ts) sigue
 * siendo la unica que habla con Supabase, y sigue aplicando `canPublishCase`. Aqui no se
 * decide que es publicable, solo que se muestra.
 */

export function applyCaseFilters(cases: CaseStudy[], filters: CaseFilters) {
  const q = filters.q?.trim().toLowerCase();

  const filtered = cases.filter((item) => {
    if (q) {
      const haystack = [
        item.title,
        item.summary,
        item.results_summary,
        item.crop?.name,
        item.country?.name,
        item.primary_problem?.name
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (filters.crop && item.crop?.slug !== filters.crop) return false;
    if (filters.country && item.country?.slug !== filters.country) return false;
    if (filters.problem && item.primary_problem?.slug !== filters.problem) return false;
    if (filters.evidence && item.evidence_level !== filters.evidence) return false;
    if (filters.minImprovement && (item.yield_increase_percent ?? 0) < Number(filters.minImprovement)) return false;
    if (filters.minRoi && (item.roi_value ?? 0) < Number(filters.minRoi)) return false;
    if (filters.media === "1" && !hasVisualEvidence(item)) return false;
    return true;
  });

  return sortCases(filtered, filters.sort);
}

export function sortCases(cases: CaseStudy[], sort?: string) {
  const sorted = [...cases];
  switch (sort) {
    case "newest":
      return sorted.sort((a, b) => date(b.published_at ?? b.created_at) - date(a.published_at ?? a.created_at));
    case "improvement":
      return sorted.sort((a, b) => (b.yield_increase_percent ?? -1) - (a.yield_increase_percent ?? -1));
    case "roi":
      return sorted.sort((a, b) => (b.roi_value ?? -1) - (a.roi_value ?? -1));
    case "confidence":
      return sorted.sort((a, b) => (b.confidence_score ?? 0) - (a.confidence_score ?? 0));
    default:
      // "Mas relevante" = la evidencia mas completa primero. Es el mismo criterio que ya
      // usaba la capa de datos, y el unico defendible: el caso mejor documentado manda.
      return sorted.sort(
        (a, b) =>
          (b.case_completeness_score ?? 0) - (a.case_completeness_score ?? 0) ||
          (b.confidence_score ?? 0) - (a.confidence_score ?? 0) ||
          a.title.localeCompare(b.title)
      );
  }
}

/**
 * Contadores de faceta. Se cuentan sobre el conjunto filtrado por TODOS los demas
 * filtros excepto el propio, que es lo que hace que un contador siga siendo util despues
 * de aplicar un filtro (si no, todas las demas facetas se irian a cero).
 */
export function getFacetCounts(cases: CaseStudy[], filters: CaseFilters): FacetCounts {
  const countBy = (key: keyof CaseFilters, pick: (item: CaseStudy) => string | undefined) => {
    const scoped = applyCaseFilters(cases, { ...filters, [key]: undefined });
    const counts: Record<string, number> = {};
    for (const item of scoped) {
      const slug = pick(item);
      if (slug) counts[slug] = (counts[slug] ?? 0) + 1;
    }
    return counts;
  };

  return {
    crops: countBy("crop", (item) => item.crop?.slug),
    countries: countBy("country", (item) => item.country?.slug),
    problems: countBy("problem", (item) => item.primary_problem?.slug),
    evidence: countBy("evidence", (item) => item.evidence_level)
  };
}

export function hasVisualEvidence(item: CaseStudy) {
  return (item.evidence_assets ?? []).some((asset) => asset.asset_type === "photo" || asset.asset_type === "video");
}

function date(value?: string | null) {
  return value ? Date.parse(value) || 0 : 0;
}
