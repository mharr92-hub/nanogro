import type { CaseStudy } from "@/lib/types";

/**
 * Indice de resultados agregados (spec, "Aggregate Results Index").
 *
 * Los guardrails de la spec no son sugerencias, son la linea que separa un sistema de
 * evidencia de un folleto:
 *   - Solo casos publicados.
 *   - Verificados y no verificados, separados.
 *   - Tamano de muestra junto a CADA cifra agregada.
 *   - Nunca implicar resultados garantizados.
 *
 * Por eso ninguna funcion de este archivo devuelve un numero solo: devuelve el numero
 * y su `sample`. Si no hay muestra, devuelve `null`, no un cero.
 */

export type Aggregate = {
  value: number | null;
  sample: number;
};

export type AggregateResults = {
  publishedCases: number;
  crops: number;
  countries: number;
  averageRoi: Aggregate;
  medianRoi: Aggregate;
  averageYieldIncrease: Aggregate;
  medianYieldIncrease: Aggregate;
  positiveImprovementRate: Aggregate;
  verifiedCases: number;
  unverifiedCases: number;
  byEvidenceLevel: Record<"A" | "B" | "C" | "D", number>;
};

const verifiedStatuses = new Set(["agronomist_review", "lab_supported", "third_party"]);

export function isVerified(item: CaseStudy) {
  return verifiedStatuses.has(item.verification_status ?? "");
}

export function getAggregateResults(cases: CaseStudy[]): AggregateResults {
  const published = cases.filter((item) => item.publication_status === "published");

  const rois = published.map((item) => item.roi_value).filter(isNumber);
  const yields = published.map((item) => item.yield_increase_percent).filter(isNumber);

  // "Mejora positiva" solo se mide sobre los casos que reportan alguna cifra de mejora.
  // Medirla sobre todos los casos inflaria el denominador con casos que no midieron nada.
  const withImprovementData = published.filter(
    (item) =>
      isNumber(item.yield_increase_percent) ||
      isNumber(item.quality_improvement_percent) ||
      isNumber(item.disease_reduction_percent)
  );
  const positive = withImprovementData.filter(
    (item) =>
      (item.yield_increase_percent ?? 0) > 0 ||
      (item.quality_improvement_percent ?? 0) > 0 ||
      (item.disease_reduction_percent ?? 0) > 0
  );

  return {
    publishedCases: published.length,
    crops: new Set(published.map((item) => item.crop?.slug).filter(Boolean)).size,
    countries: new Set(published.map((item) => item.country?.slug).filter(Boolean)).size,
    averageRoi: { value: mean(rois), sample: rois.length },
    medianRoi: { value: median(rois), sample: rois.length },
    averageYieldIncrease: { value: mean(yields), sample: yields.length },
    medianYieldIncrease: { value: median(yields), sample: yields.length },
    positiveImprovementRate: {
      value: withImprovementData.length ? round((positive.length / withImprovementData.length) * 100, 0) : null,
      sample: withImprovementData.length
    },
    verifiedCases: published.filter(isVerified).length,
    unverifiedCases: published.filter((item) => !isVerified(item)).length,
    byEvidenceLevel: {
      A: published.filter((item) => item.evidence_level === "A").length,
      B: published.filter((item) => item.evidence_level === "B").length,
      C: published.filter((item) => item.evidence_level === "C").length,
      D: published.filter((item) => item.evidence_level === "D").length
    }
  };
}

/** Rango de mejora observado en un conjunto de casos comparables. Base del calculador de ROI. */
export function getYieldRange(cases: CaseStudy[]) {
  const values = cases.map((item) => item.yield_increase_percent).filter(isNumber).filter((value) => value > 0);
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  return {
    low: sorted[0],
    high: sorted[sorted.length - 1],
    median: median(sorted) as number,
    sample: sorted.length
  };
}

export function formatAggregate(entry: Aggregate, suffix: string, decimals = 1): string | null {
  if (entry.value === null) return null;
  return `${round(entry.value, decimals)}${suffix}`;
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function mean(values: number[]) {
  if (!values.length) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function median(values: number[]) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
}

function round(value: number, decimals: number) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}
