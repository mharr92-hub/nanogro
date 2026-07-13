import type { CaseStudy, EvidenceAsset } from "@/lib/types";

const originalReportTypes: EvidenceAsset["asset_type"][] = ["pdf", "document", "lab_report", "raw_data"];
const technicalValidationStatuses = new Set(["agronomist_review", "lab_supported", "third_party", "extracted_pending_review"]);

export type EvidenceProfile = {
  hasOriginalReport: boolean;
  hasPhotos: boolean;
  hasVideo: boolean;
  hasPdf: boolean;
  hasTestimonial: boolean;
  hasTechnicalValidation: boolean;
  hasTrackedEstimatedData: boolean;
  publicationEligible: boolean;
  originalReport?: EvidenceAsset;
  reasons: string[];
};

export function getEvidenceProfile(item: CaseStudy): EvidenceProfile {
  const assets = item.evidence_assets ?? [];
  const hasOriginalReport = assets.some((asset) => originalReportTypes.includes(asset.asset_type));
  const hasPhotos = assets.some((asset) => asset.asset_type === "photo");
  const hasVideo = assets.some((asset) => asset.asset_type === "video");
  const hasPdf = assets.some((asset) => asset.asset_type === "pdf");
  const hasTestimonial = hasApprovedTestimonial(item);
  const hasTechnicalValidation = technicalValidationStatuses.has(item.verification_status ?? "") || (item.evidence_score ?? 0) >= 80;
  const hasEvidenceForPublication = hasOriginalReport || hasPhotos || hasVideo || hasPdf || hasTestimonial || hasTechnicalValidation;
  const hasTrackedEstimatedData = estimatesAreTracked(item);
  const reasons = [];
  if (!hasEvidenceForPublication) reasons.push("No evidence asset, approved testimonial, or technical validation is attached.");
  if (!hasTrackedEstimatedData) reasons.push("Estimated or inferred fields must be marked in field_status before publication.");
  return {
    hasOriginalReport,
    hasPhotos,
    hasVideo,
    hasPdf,
    hasTestimonial,
    hasTechnicalValidation,
    hasTrackedEstimatedData,
    publicationEligible: hasEvidenceForPublication && hasTrackedEstimatedData,
    originalReport: assets.find((asset) => originalReportTypes.includes(asset.asset_type)),
    reasons
  };
}

export function canPublishCase(item: CaseStudy) {
  return getEvidenceProfile(item).publicationEligible;
}

export function hasApprovedTestimonial(item: CaseStudy) {
  const fields = item.field_status ?? {};
  const testimonialStatus = fields.testimonial;
  if (testimonialStatus === "verified") return true;
  return (item.evidence_reference ?? "").toLowerCase().includes("testimonial") && item.verification_status !== "unverified";
}

function estimatesAreTracked(item: CaseStudy) {
  const fields = item.field_status ?? {};
  const estimated = item.estimated_fields ?? [];
  const inferred = item.inferred_fields ?? [];
  return estimated.every((field) => fields[field] === "estimated") && inferred.every((field) => fields[field] === "inferred");
}

export function boolLabel(value: boolean, labels: { yes: string; no: string }) {
  return value ? labels.yes : labels.no;
}
