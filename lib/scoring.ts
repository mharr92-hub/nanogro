import type { EvidenceAsset } from "@/lib/types";

export function calculateCompletenessScore(input: {
  summary?: string | null;
  results_summary?: string | null;
  roi_value?: number | null;
  evidence?: EvidenceAsset[];
  hasTestimonial?: boolean;
  verification_status?: string | null;
}) {
  let score = 0;
  const evidence = input.evidence ?? [];
  if (input.summary) score += 10;
  if (input.results_summary) score += 10;
  if (typeof input.roi_value === "number") score += 10;
  if (evidence.some((asset) => asset.asset_type === "photo")) score += 20;
  if (evidence.some((asset) => asset.asset_type === "video")) score += 20;
  if (evidence.some((asset) => ["pdf", "document", "lab_report"].includes(asset.asset_type))) score += 10;
  if (input.hasTestimonial) score += 10;
  if (["agronomist_review", "lab_supported", "third_party"].includes(input.verification_status ?? "")) score += 10;
  return Math.min(score, 100);
}

export function calculateEvidenceScore(evidence: EvidenceAsset[] = []) {
  let score = 0;
  if (evidence.some((asset) => asset.asset_type === "photo" && asset.evidence_stage === "before")) score += 20;
  if (evidence.some((asset) => asset.asset_type === "photo" && asset.evidence_stage === "after")) score += 20;
  if (evidence.some((asset) => asset.asset_type === "video")) score += 20;
  if (evidence.some((asset) => ["pdf", "document"].includes(asset.asset_type))) score += 15;
  if (evidence.some((asset) => asset.asset_type === "lab_report")) score += 15;
  // El bono de consentimiento exige que exista evidencia: [].every(...) es true, y un caso
  // sin una sola foto no puede puntuar por tener el consentimiento en regla.
  const fullyConsented =
    evidence.length > 0 &&
    evidence.every((asset) => asset.consent_status === "approved" && asset.verification_status === "approved");
  if (fullyConsented) score += 10;
  return Math.min(score, 100);
}

export function calculateConfidenceScore(input: {
  evidence_level?: string | null;
  case_completeness_score?: number | null;
  evidence_score?: number | null;
  verification_status?: string | null;
}) {
  const levelBase = { A: 35, B: 25, C: 15, D: 5 }[input.evidence_level ?? "D"] ?? 5;
  const completeness = Math.round((input.case_completeness_score ?? 0) * 0.35);
  const evidence = Math.round((input.evidence_score ?? 0) * 0.2);
  const verification = ["agronomist_review", "lab_supported", "third_party"].includes(input.verification_status ?? "") ? 10 : 0;
  return Math.min(levelBase + completeness + evidence + verification, 100);
}

export function calculateLeadScore(input: {
  hectares?: number | null;
  whatsapp?: string | null;
  email?: string | null;
  problemMatchesPublishedCase?: boolean;
  cropPublishedCount?: number;
  relatedViewedCount?: number;
  requestedDiagnostic?: boolean;
  countryHasDistributorInterest?: boolean;
}) {
  let score = 0;
  if (input.hectares) score += 15;
  if (input.whatsapp) score += 15;
  if (input.email) score += 10;
  if (input.problemMatchesPublishedCase) score += 15;
  if ((input.cropPublishedCount ?? 0) >= 3) score += 15;
  if ((input.relatedViewedCount ?? 0) >= 2) score += 10;
  if (input.requestedDiagnostic) score += 10;
  if (input.countryHasDistributorInterest) score += 10;
  return Math.min(score, 100);
}
