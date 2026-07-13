import type { CaseStudy } from "@/lib/types";

/**
 * Matching del diagnostico (spec, seccion 12: "Matching Logic — rule-based matching for
 * MVP using crop, problem, climate, soil, growth stage, and country").
 *
 * Existe para cumplir la regla mas importante del diagnostico: el usuario recibe valor
 * ANTES de que nadie le venda nada. Al enviar el formulario obtiene casos similares, la
 * categoria probable de su problema y una recomendacion preliminar. La llamada comercial
 * viene despues, no antes.
 */

export type DiagnosticAnswers = {
  countrySlug?: string;
  cropSlug?: string;
  problemSlug?: string;
  hectares?: number;
};

export type DiagnosticMatch = CaseStudy & {
  matchScore: number;
  reasonKeys: MatchReasonKey[];
};

export type MatchReasonKey = "sameCrop" | "sameProblem" | "sameCountry" | "strongEvidence" | "completeCase";

export function matchCases(answers: DiagnosticAnswers, cases: CaseStudy[], limit = 3): DiagnosticMatch[] {
  return cases
    .map((item) => {
      let matchScore = 0;
      const reasonKeys: MatchReasonKey[] = [];

      if (answers.cropSlug && item.crop?.slug === answers.cropSlug) {
        matchScore += 30;
        reasonKeys.push("sameCrop");
      }
      if (answers.problemSlug && item.primary_problem?.slug === answers.problemSlug) {
        matchScore += 30;
        reasonKeys.push("sameProblem");
      }
      if (answers.countrySlug && item.country?.slug === answers.countrySlug) {
        matchScore += 20;
        reasonKeys.push("sameCountry");
      }
      if (item.evidence_level === "A" || item.evidence_level === "B") {
        matchScore += 10;
        reasonKeys.push("strongEvidence");
      }
      if ((item.case_completeness_score ?? 0) >= 80) {
        matchScore += 10;
        reasonKeys.push("completeCase");
      }

      return { ...item, matchScore, reasonKeys };
    })
    .filter((item) => item.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore || (b.confidence_score ?? 0) - (a.confidence_score ?? 0))
    .slice(0, limit);
}

/**
 * Recomendacion preliminar: se deriva de los casos que hicieron match, nunca de una
 * plantilla generica. Si no hay casos comparables, se dice que no los hay.
 */
export function getPreliminaryRecommendation(matches: DiagnosticMatch[]) {
  const applications = matches
    .map((item) => item.nano_gro_application)
    .filter((value): value is string => Boolean(value && value.trim()));

  const withYield = matches.map((item) => item.yield_increase_percent).filter((value): value is number => typeof value === "number");

  return {
    hasMatches: matches.length > 0,
    // La aplicacion mas frecuente entre los casos que hicieron match.
    suggestedApplication: mostFrequent(applications),
    observedImprovementLow: withYield.length ? Math.min(...withYield) : null,
    observedImprovementHigh: withYield.length ? Math.max(...withYield) : null,
    sample: withYield.length
  };
}

function mostFrequent(values: string[]) {
  if (!values.length) return null;
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
}
