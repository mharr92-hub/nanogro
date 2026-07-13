// Scientific confidence score (spec §4). Transparent, weighted, and always
// displayed with its breakdown — credibility depends on showing *why*.

export type VerificationStatus =
  | "UNVERIFIED"
  | "SELF_REPORTED"
  | "DISTRIBUTOR_VERIFIED"
  | "AGRONOMIST_VERIFIED"
  | "LAB_VERIFIED";

export interface ConfidenceInput {
  hasControlGroup: boolean;
  verificationStatus: VerificationStatus;
  labReportCount: number;
  // media completeness signals
  hasBeforeAfter: boolean;
  photoCount: number;
  // data completeness: how many key result metrics are present (0–4)
  resultMetricsPresent: number;
  // replication / multi-season evidence
  multiSeason: boolean;
}

export interface ConfidenceComponent {
  key: string;
  label: string;
  earned: number;
  max: number;
}

export interface ConfidenceResult {
  score: number; // 0–100
  components: ConfidenceComponent[];
}

const VERIFICATION_POINTS: Record<VerificationStatus, number> = {
  UNVERIFIED: 0,
  SELF_REPORTED: 6,
  DISTRIBUTOR_VERIFIED: 14,
  AGRONOMIST_VERIFIED: 22,
  LAB_VERIFIED: 30,
};

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

export function computeConfidence(input: ConfidenceInput): ConfidenceResult {
  const controlGroup = input.hasControlGroup ? 25 : 0;
  const verification = VERIFICATION_POINTS[input.verificationStatus] ?? 0;
  const lab = clamp(input.labReportCount * 8, 0, 15);

  const mediaCompleteness =
    (input.hasBeforeAfter ? 6 : 0) + clamp(input.photoCount, 0, 4);
  const dataCompleteness = clamp(
    Math.round((input.resultMetricsPresent / 4) * 10),
    0,
    10,
  );
  const replication = input.multiSeason ? 10 : 0;

  const components: ConfidenceComponent[] = [
    { key: "control", label: "Control group", earned: controlGroup, max: 25 },
    { key: "verification", label: "Verification level", earned: verification, max: 30 },
    { key: "lab", label: "Lab reports", earned: lab, max: 15 },
    { key: "media", label: "Media completeness", earned: mediaCompleteness, max: 10 },
    { key: "data", label: "Data completeness", earned: dataCompleteness, max: 10 },
    { key: "replication", label: "Multi-season replication", earned: replication, max: 10 },
  ];

  const score = clamp(
    components.reduce((sum, c) => sum + c.earned, 0),
    0,
    100,
  );

  return { score, components };
}

// Derive the qualitative success level from headline results (spec §5 banding).
export function deriveSuccessLevel(
  yieldIncreasePct: number | null | undefined,
  roiPct: number | null | undefined,
): "LOW" | "MODERATE" | "HIGH" | "EXCEPTIONAL" {
  const y = yieldIncreasePct ?? 0;
  const r = roiPct ?? 0;
  if (y >= 40 || r >= 400) return "EXCEPTIONAL";
  if (y >= 20 || r >= 200) return "HIGH";
  if (y >= 8 || r >= 80) return "MODERATE";
  return "LOW";
}
