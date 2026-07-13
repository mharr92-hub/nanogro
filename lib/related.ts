import type { CaseStudy } from "@/lib/types";

/**
 * Casos relacionados (MVP de 48h: "Related Case Recommendations", con sus pesos).
 *
 * Las razones se devuelven como CLAVES, no como texto. Antes se devolvian en ingles y la
 * pagina de detalle las traducia con un mapa de strings incrustado: si alguien cambiaba
 * "Same crop" aqui, la traduccion se rompia en silencio. Ahora la clave es el contrato y
 * el texto vive en messages/*.json (namespace `matchReasons`).
 */

export type RelatedReasonKey =
  | "sameCrop"
  | "sameProblem"
  | "sameCountry"
  | "sameRegion"
  | "similarApplication"
  | "strongEvidence"
  | "completeCase";

export type RelatedCase = CaseStudy & {
  relatedScore: number;
  reasonKeys: RelatedReasonKey[];
};

export function getRelatedCases(current: CaseStudy, allCases: CaseStudy[], limit = 6): RelatedCase[] {
  return allCases
    .filter((item) => item.id !== current.id && item.publication_status === "published")
    .map((item) => {
      let relatedScore = 0;
      const reasonKeys: RelatedReasonKey[] = [];

      if (item.crop_id === current.crop_id) {
        relatedScore += 30;
        reasonKeys.push("sameCrop");
      }
      if (item.primary_problem_id === current.primary_problem_id) {
        relatedScore += 30;
        reasonKeys.push("sameProblem");
      }
      if (item.country_id === current.country_id) {
        relatedScore += 20;
        reasonKeys.push("sameCountry");
      }
      if (item.region_id && current.region_id && item.region_id === current.region_id) {
        relatedScore += 10;
        reasonKeys.push("sameRegion");
      }
      if (item.application_method_id && item.application_method_id === current.application_method_id) {
        relatedScore += 10;
        reasonKeys.push("similarApplication");
      }
      if (item.evidence_level <= current.evidence_level) {
        relatedScore += 10;
        reasonKeys.push("strongEvidence");
      }
      if ((item.case_completeness_score ?? 0) >= 80) {
        relatedScore += 10;
        reasonKeys.push("completeCase");
      }

      return { ...item, relatedScore, reasonKeys };
    })
    .filter((item) => item.relatedScore > 0)
    .sort((a, b) => b.relatedScore - a.relatedScore)
    .slice(0, limit);
}
