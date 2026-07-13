import type { CaseStudy } from "@/lib/types";

export function getRelatedCases(current: CaseStudy, allCases: CaseStudy[], limit = 6) {
  return allCases
    .filter((item) => item.id !== current.id && item.publication_status === "published")
    .map((item) => {
      let score = 0;
      const reasons: string[] = [];
      if (item.crop_id === current.crop_id) {
        score += 30;
        reasons.push("Same crop");
      }
      if (item.primary_problem_id === current.primary_problem_id) {
        score += 30;
        reasons.push("Same problem");
      }
      if (item.country_id === current.country_id) {
        score += 20;
        reasons.push("Same country");
      }
      if (item.region_id && current.region_id && item.region_id === current.region_id) {
        score += 10;
        reasons.push("Same region");
      }
      if (item.application_method_id && item.application_method_id === current.application_method_id) {
        score += 10;
        reasons.push("Similar application");
      }
      if (item.evidence_level <= current.evidence_level) {
        score += 10;
        reasons.push("High evidence level");
      }
      if ((item.case_completeness_score ?? 0) >= 80) {
        score += 10;
        reasons.push("Complete case");
      }
      return { ...item, relatedScore: score, reasons };
    })
    .filter((item) => item.relatedScore > 0)
    .sort((a, b) => b.relatedScore - a.relatedScore)
    .slice(0, limit);
}
