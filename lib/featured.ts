import { isVerified } from "@/lib/aggregate";
import type { CaseStudy } from "@/lib/types";

/**
 * Que casos merecen ir en portada.
 *
 * Antes la home cogia los tres primeros del listado, ordenado por completitud. Eso puso de
 * caso estrella un frijol con ROI 0.54x y un tabaco con +100% de rendimiento. Los dos
 * juegan en contra:
 *
 *   - ROI < 1 significa que el programa costo MAS de lo que devolvio. Es un dato honesto y
 *     debe seguir publicado en su ficha, pero destacarlo en portada como prueba comercial
 *     es incoherente: lo que demuestra es lo contrario de lo que se quiere demostrar.
 *   - Una mejora extrema (>= 60%) dispara escepticismo aunque sea real y verificada. En la
 *     home, donde el visitante aun no sabe si fiarse, el caso mas creible gana al mas
 *     espectacular.
 *
 * Los dos siguen accesibles en el listado y en su hub. No se ocultan: se dejan de destacar.
 */

const MIN_CREDIBLE_ROI = 1.5;
const MAX_CREDIBLE_YIELD = 60;

export function getFeaturedCases(cases: CaseStudy[], limit = 3) {
  const credible = cases.filter(isCredibleShowcase);
  const ranked = [...credible].sort(rankForShowcase);
  if (ranked.length >= limit) return ranked.slice(0, limit);

  // Si no hay suficientes casos creibles, se completa con los mejor documentados del resto
  // antes que dejar la portada vacia. La ficha sigue diciendo la verdad de cada uno.
  const rest = cases.filter((item) => !credible.includes(item)).sort(rankForShowcase);
  return [...ranked, ...rest].slice(0, limit);
}

function isCredibleShowcase(item: CaseStudy) {
  // Un ROI publicado por debajo del umbral descarta el caso de portada. Que no haya ROI no
  // lo descarta: hay casos solidos que no calcularon el retorno.
  if (typeof item.roi_value === "number" && item.roi_value < MIN_CREDIBLE_ROI) return false;
  if (typeof item.yield_increase_percent === "number" && item.yield_increase_percent >= MAX_CREDIBLE_YIELD) return false;
  return true;
}

/** Primero lo verificado, luego lo mejor documentado. La credibilidad manda sobre la cifra. */
function rankForShowcase(a: CaseStudy, b: CaseStudy) {
  return (
    Number(isVerified(b)) - Number(isVerified(a)) ||
    (b.confidence_score ?? 0) - (a.confidence_score ?? 0) ||
    (b.case_completeness_score ?? 0) - (a.case_completeness_score ?? 0)
  );
}
