import type { Messages } from "@/lib/i18n-shared";
import type { CaseStudy, ExtractedMetric } from "@/lib/types";

/**
 * Las cifras que enseña la Ficha de Evidencia.
 *
 * Se construye UNA lista ordenada de candidatas y la ficha toma la primera y la segunda. Es
 * la unica forma de garantizar que no se repite la misma cifra en los dos huecos: antes cada
 * hueco se calculaba por su cuenta y en varios casos acababa mostrando "25 dias" dos veces.
 *
 * Orden: rendimiento, calidad, reduccion de enfermedad, ROI, las metricas transcritas del
 * informe original, y por ultimo el estado real del caso (resultado documentado sin cifra, o
 * informe pendiente de extraer). Nunca se inventa un numero para rellenar.
 */

export type CaseFigure = {
  label: string;
  value: string;
};

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function signed(value: number) {
  return `${value > 0 ? "+" : ""}${value}%`;
}

/** "98%" y no "98 %"; pero "25 días" con su espacio. */
function withUnit(value: ExtractedMetric["value"], unit?: string | null) {
  const text = String(value ?? "").trim();
  const suffix = unit?.trim();
  if (!suffix) return text;
  return suffix === "%" ? `${text}%` : `${text} ${suffix}`;
}

/** Los "PDF requires conversion..." son avisos internos, no resultados. */
const PLACEHOLDER_RESULT =
  /requires? (text )?(conversion|extraction|ocr)|pending (technical )?(review|confirmation)|pendiente de (confirmaci[oó]n|revisi[oó]n)|requiere (conversi[oó]n|extracci[oó]n)/i;

function extractedMetrics(item: CaseStudy): ExtractedMetric[] {
  const groups = item.extracted_metrics;
  if (!groups || typeof groups !== "object") return [];
  return Object.values(groups)
    .filter(Array.isArray)
    .flat()
    .filter((entry): entry is ExtractedMetric => {
      if (!entry || typeof entry !== "object") return false;
      const metric = entry as Partial<ExtractedMetric>;
      return typeof metric.label === "string" && String(metric.value ?? "").trim().length > 0;
    });
}

function hasDocumentedResult(item: CaseStudy) {
  const summary = item.results_summary?.trim();
  return Boolean(summary && !PLACEHOLDER_RESULT.test(summary));
}

function awaitsExtraction(item: CaseStudy) {
  if ((item.data_status ?? "").includes("needs_extraction")) return true;
  const summary = item.results_summary?.trim();
  return Boolean(summary && PLACEHOLDER_RESULT.test(summary));
}

/** Todas las cifras publicables del caso, de la mas relevante a la menos. Sin repeticiones. */
export function getCaseFigures(item: CaseStudy, messages: Messages): CaseFigure[] {
  const figures: CaseFigure[] = [];
  const seen = new Set<string>();

  const push = (label: string, value: string) => {
    const key = `${label}|${value}`.toLowerCase();
    if (seen.has(key) || seen.has(value.toLowerCase())) return;
    seen.add(key);
    seen.add(value.toLowerCase());
    figures.push({ label, value });
  };

  if (isNumber(item.yield_increase_percent)) push(messages.sheet.result, signed(item.yield_increase_percent));
  if (isNumber(item.quality_improvement_percent)) push(messages.sheet.quality, signed(item.quality_improvement_percent));
  if (isNumber(item.disease_reduction_percent))
    push(messages.sheet.diseaseReduction, `-${item.disease_reduction_percent}%`);
  if (isNumber(item.roi_value)) push(messages.sheet.roi, `${item.roi_value}x`);

  for (const metric of extractedMetrics(item)) {
    push(metric.label.trim() || messages.sheet.result, withUnit(metric.value, metric.unit));
  }

  // Sin ninguna cifra, se dice lo que hay: hay resultado documentado, o el informe original
  // sigue sin extraerse. Las dos cosas son ciertas y comprobables; un numero inventado no.
  if (!figures.length) {
    if (hasDocumentedResult(item)) push(messages.sheet.result, messages.sheet.documented);
    else if (awaitsExtraction(item)) push(messages.sheet.sourceStatus, messages.sheet.pendingExtraction);
  }

  // El relleno del segundo hueco, si hace falta, es un dato real: cuanta evidencia trae.
  if (figures.length < 2 && isNumber(item.case_completeness_score)) {
    push(messages.sheet.completeness, `${item.case_completeness_score}/100`);
  }

  return figures;
}
