import { prisma } from "./db";
import { caseCardSelect, type CaseCard } from "./search";

// Rule-based diagnostic engine (spec §10). Maps questionnaire answers to likely
// causes + recommendations via DiagnosticRule rows, and surfaces matching cases.

export interface DiagnosticAnswers {
  crop?: string; // crop slug
  climate?: string;
  symptoms: string[]; // symptom keys
  stage?: string;
  goal?: string;
}

export interface DiagnosticIssue {
  causeEn: string;
  causeEs: string;
  recommendationEn: string;
  recommendationEs: string;
  productName: string | null;
  dosage: string | null;
  applicationMethod: string | null;
  problemSlug: string | null;
}

export interface DiagnosticResult {
  issues: DiagnosticIssue[];
  matchedCases: CaseCard[];
}

export async function runDiagnostic(answers: DiagnosticAnswers): Promise<DiagnosticResult> {
  const rules = await prisma.diagnosticRule.findMany({
    where: {
      OR: [{ cropSlug: null }, { cropSlug: answers.crop ?? "__none__" }],
    },
    orderBy: { priority: "desc" },
  });

  // Score rules by symptom overlap; keep those with at least one matched symptom.
  const symptomSet = new Set(answers.symptoms);
  const ranked = rules
    .map((r) => ({
      rule: r,
      overlap: r.symptomKeys.filter((s) => symptomSet.has(s)).length,
    }))
    .filter((x) => x.overlap > 0 || x.rule.symptomKeys.length === 0)
    .sort((a, b) => b.overlap - a.overlap || b.rule.priority - a.rule.priority)
    .slice(0, 4);

  const issues: DiagnosticIssue[] = ranked.map(({ rule }) => ({
    causeEn: rule.causeEn,
    causeEs: rule.causeEs,
    recommendationEn: rule.recommendationEn,
    recommendationEs: rule.recommendationEs,
    productName: rule.productName,
    dosage: rule.dosage,
    applicationMethod: rule.applicationMethod,
    problemSlug: rule.problemSlug,
  }));

  // Surface matching published cases: same crop and/or matched problems.
  const problemSlugs = issues.map((i) => i.problemSlug).filter((s): s is string => !!s);
  const matchedCases = await prisma.case.findMany({
    where: {
      publicationStatus: "PUBLISHED",
      AND: [
        answers.crop ? { crop: { slug: answers.crop } } : {},
        problemSlugs.length ? { problems: { some: { slug: { in: problemSlugs } } } } : {},
      ],
    },
    orderBy: [{ confidenceScore: "desc" }],
    take: 4,
    select: caseCardSelect,
  });

  return { issues, matchedCases };
}
