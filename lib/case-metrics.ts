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

  /*
   * Quedan los casos cuyo informe original es un PDF o un .doc que todavia no se ha
   * convertido a texto: Ecuador, Nigeria, Polonia, Jamaica, Cuba, Mexico... Ahi no hay
   * ninguna cifra que enseñar porque nadie ha leido aun el documento.
   *
   * "No reportado" seria mentir (el informe puede reportar mucho; simplemente no lo hemos
   * extraido) e inventarse un numero seria peor. Se dice exactamente lo que pasa: la fuente
   * esta adjunta y pendiente de extraer. El visitante puede descargar el documento y leerlo
   * el mismo, que es mas honesto que cualquier cifra que pudieramos ponerle.
   */
  if (awaitsExtraction(item)) {
    return { label: messages.sheet.sourceStatus, value: messages.sheet.pendingExtraction, isYield: false };
  }

  return null;
}

function awaitsExtraction(item: CaseStudy) {
  if ((item.data_status ?? "").includes("needs_extraction")) return true;
  const summary = item.results_summary?.trim();
  return Boolean(summary && PLACEHOLDER_RESULT.test(summary));
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

/**
 * La SEGUNDA cifra de la ficha.
 *
 * El hueco central era siempre el ROI, y como 26 de los 27 casos nunca lo calcularon, casi
 * todas las fichas mostraban "No reportado" en el centro. En vez de dejar el vacio (o de
 * inventarse un ROI, que seria publicar un dato falso), el hueco se llena con la siguiente
 * cifra documentada del caso: la segunda metrica del informe, la mejora de calidad o la
 * completitud de la evidencia. Siempre hay algo real que enseñar.
 */
export function getSecondaryResult(item: CaseStudy, messages: Messages): PrimaryResult | null {
  if (isNumber(item.roi_value)) {
    return { label: messages.sheet.roi, value: `${item.roi_value}x`, isYield: false };
  }

  const primary = getPrimaryResult(item, messages);
  const metrics = allExtractedMetrics(item);
  // La primera metrica distinta de la que ya ocupa el hueco del "Resultado".
  const next = metrics.find((metric) => `${metric.value}` !== primary?.value?.replace(/[+%]/g, ""));
  if (next) {
    const unit = next.unit?.trim();
    return {
      label: next.label.trim() || messages.sheet.result,
      value: `${next.value}${unit ? ` ${unit}` : ""}`,
      isYield: false
    };
  }

  if (isNumber(item.quality_improvement_percent) && primary?.label !== messages.sheet.quality) {
    return { label: messages.sheet.quality, value: signed(item.quality_improvement_percent), isYield: false };
  }

  // Ultimo recurso, y sigue siendo un dato real: cuanta evidencia tiene el caso.
  if (isNumber(item.case_completeness_score)) {
    return {
      label: messages.sheet.completeness,
      value: `${item.case_completeness_score}/100`,
      isYield: false
    };
  }

  return null;
}

function allExtractedMetrics(item: CaseStudy): ExtractedMetric[] {
  const groups = item.extracted_metrics;
  if (!groups || typeof groups !== "object") return [];
  return Object.values(groups)
    .filter(Array.isArray)
    .flat()
    .filter(isUsableMetric);
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function signed(value: number) {
  return `${value > 0 ? "+" : ""}${value}%`;
}
