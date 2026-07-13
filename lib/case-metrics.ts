import type { Messages } from "@/lib/i18n-shared";
import type { CaseStudy, ExtractedMetric } from "@/lib/types";

/**
 * La metrica principal de un caso.
 *
 * La Ficha de Evidencia solo miraba `yield_increase_percent`, asi que un caso titulado
 * "Chile en El Salvador con cosecha 25 dias mas temprana" mostraba "Resultado: No
 * reportado", que es falso: el resultado existe, solo que no es un porcentaje de
 * rendimiento. Veinte de veintisiete casos se presentaban como si no hubieran medido nada.
 *
 * Orden de preferencia: rendimiento, calidad, reduccion de enfermedad y, si no hay ninguno
 * de los tres, la primera metrica extraida del informe original (dias de adelanto,
 * supervivencia, vigor radicular...). Solo se dice "No reportado" cuando de verdad no hay
 * nada medido.
 */

export type PrimaryResult = {
  label: string;
  value: string;
  /** Los porcentajes de rendimiento son la metrica canonica; el resto se marca para no compararlos a ciegas. */
  isYield: boolean;
};

export function getPrimaryResult(item: CaseStudy, messages: Messages): PrimaryResult | null {
  if (isNumber(item.yield_increase_percent)) {
    return { label: messages.sheet.result, value: signed(item.yield_increase_percent), isYield: true };
  }
  if (isNumber(item.quality_improvement_percent)) {
    return { label: messages.sheet.quality, value: signed(item.quality_improvement_percent), isYield: false };
  }
  if (isNumber(item.disease_reduction_percent)) {
    return { label: messages.sheet.diseaseReduction, value: `-${item.disease_reduction_percent}%`, isYield: false };
  }

  const extracted = firstExtractedMetric(item);
  if (extracted) {
    const unit = extracted.unit?.trim();
    return {
      label: extracted.label.trim() || messages.sheet.result,
      value: `${extracted.value}${unit ? ` ${unit}` : ""}`,
      isYield: false
    };
  }

  /*
   * Ultimo recurso honesto.
   *
   * De los casos reales, la mayoria documenta un resultado en prosa ("cosecha 25 dias mas
   * temprana", "supervivencia del 98%") pero no tiene ninguna cifra en un campo
   * estructurado. Poner "No reportado" en su ficha es MENTIR al reves: el caso si midio
   * algo, solo que la cifra aun no esta normalizada en la base.
   *
   * Tampoco se inventa un numero sacandolo del texto con expresiones regulares: eso seria
   * adivinar y publicarlo como dato. Se dice lo unico que se puede sostener: hay resultado
   * documentado, y esta escrito en la pagina del caso.
   *
   * La solucion definitiva no es de interfaz: es normalizar esas cifras al importar.
   */
  if (hasDocumentedResult(item)) {
    return { label: messages.sheet.result, value: messages.sheet.documented, isYield: false };
  }

  return null;
}

/** Los textos "PDF requires conversion..." son placeholders internos, no resultados. */
const PLACEHOLDER_RESULT = /requires? (text )?(conversion|extraction|ocr)|pending (technical )?(review|confirmation)|pendiente de (confirmaci[oó]n|revisi[oó]n)|requiere (conversi[oó]n|extracci[oó]n)/i;

function hasDocumentedResult(item: CaseStudy) {
  const summary = item.results_summary?.trim();
  if (!summary) return false;
  return !PLACEHOLDER_RESULT.test(summary);
}

/**
 * `extracted_metrics` es un jsonb sin forma garantizada (Record<string, unknown>): lo que
 * guarda depende de como se extrajo cada informe original. Se recorre con una guarda de
 * tipo en vez de asumir una estructura que la base no obliga a cumplir.
 */
function firstExtractedMetric(item: CaseStudy): ExtractedMetric | null {
  const groups = item.extracted_metrics;
  if (!groups || typeof groups !== "object") return null;

  for (const group of Object.values(groups)) {
    if (!Array.isArray(group)) continue;
    for (const entry of group) {
      if (isUsableMetric(entry)) return entry;
    }
  }
  return null;
}

function isUsableMetric(value: unknown): value is ExtractedMetric {
  if (!value || typeof value !== "object") return false;
  const metric = value as Partial<ExtractedMetric>;
  return typeof metric.label === "string" && String(metric.value ?? "").trim().length > 0;
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function signed(value: number) {
  return `${value > 0 ? "+" : ""}${value}%`;
}
