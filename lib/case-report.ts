import type { CaseStudy, EvidenceAsset, FieldStatus } from "@/lib/types";
import type { Messages } from "@/lib/i18n";
import { publicContentText, publicEvidenceLabel } from "@/lib/evidence-labels";

export const trackedFields = [
  "farm_size",
  "crop",
  "country",
  "region",
  "problem",
  "dosage",
  "application_method",
  "application_frequency",
  "baseline_yield",
  "final_yield",
  "yield_increase_percent",
  "roi_value",
  "treatment_dates",
  "harvest_dates",
  "result_summary",
  "testimonial",
  "photos",
  "videos",
  "lab_reports",
  "source_full_text",
  "technical_summary",
  "executive_narrative",
  "extracted_observations",
  "extracted_recommendations",
  "extracted_results",
  "extracted_metrics"
] as const;

export function generateCaseDataQuality(input: {
  title?: string | null;
  crop?: string | null;
  country?: string | null;
  region?: string | null;
  problem?: string | null;
  farm_size_value?: number | null;
  dosage?: string | null;
  application_method?: string | null;
  application_frequency?: string | null;
  baseline_conditions?: string | null;
  results_summary?: string | null;
  yield_increase_percent?: number | null;
  roi_value?: number | null;
  hasPhotos?: boolean;
  hasVideos?: boolean;
  hasLabReports?: boolean;
  hasTestimonial?: boolean;
  evidence_level?: string | null;
  source_full_text?: string | null;
  technical_summary?: string | null;
  executive_narrative?: string | null;
  extracted_observations?: string | null;
  extracted_recommendations?: string | null;
  extracted_results?: string | null;
  extracted_metrics?: string | null;
}) {
  const inferred_fields: string[] = [];
  const field_status: Record<string, FieldStatus> = {
    crop: input.crop ? "verified" : "pending_confirmation",
    country: input.country ? "verified" : "pending_confirmation",
    region: input.region ? "verified" : "unavailable",
    problem: input.problem ? "verified" : "pending_confirmation",
    farm_size: input.farm_size_value ? "verified" : "unavailable",
    dosage: input.dosage ? "verified" : "pending_confirmation",
    application_method: input.application_method ? "verified" : "pending_confirmation",
    application_frequency: input.application_frequency ? "verified" : "pending_confirmation",
    baseline_yield: input.baseline_conditions ? "verified" : "pending_confirmation",
    final_yield: input.results_summary ? "pending_confirmation" : "unavailable",
    yield_increase_percent: input.yield_increase_percent ? "verified" : "pending_confirmation",
    roi_value: input.roi_value ? "verified" : "pending_confirmation",
    treatment_dates: "pending_confirmation",
    harvest_dates: "pending_confirmation",
    result_summary: input.results_summary ? "verified" : "pending_confirmation",
    testimonial: input.hasTestimonial ? "verified" : "unavailable",
    photos: input.hasPhotos ? "verified" : "pending_confirmation",
    videos: input.hasVideos ? "verified" : "unavailable",
    lab_reports: input.hasLabReports ? "verified" : "unavailable",
    source_full_text: input.source_full_text ? "verified" : "pending_confirmation",
    technical_summary: input.technical_summary ? "verified" : "pending_confirmation",
    executive_narrative: input.executive_narrative ? "verified" : "pending_confirmation",
    extracted_observations: input.extracted_observations ? "verified" : "pending_confirmation",
    extracted_recommendations: input.extracted_recommendations ? "verified" : "pending_confirmation",
    extracted_results: input.extracted_results ? "verified" : "pending_confirmation",
    extracted_metrics: input.extracted_metrics ? "verified" : "pending_confirmation"
  };
  if (!input.application_method && input.evidence_level && input.evidence_level !== "D") {
    field_status.application_method = "inferred";
    inferred_fields.push("application_method");
  }

  const missing_fields = trackedFields.filter((field) => ["unavailable", "pending_confirmation"].includes(field_status[field]));
  const pending_confirmation_fields = trackedFields.filter((field) => field_status[field] === "pending_confirmation");
  const technical_questions = generateTechnicalQuestions(pending_confirmation_fields);
  const hasCriticalPending = pending_confirmation_fields.some((field) =>
    [
      "problem",
      "dosage",
      "application_method",
      "application_frequency",
      "yield_increase_percent",
      "roi_value",
      "photos",
      "source_full_text",
      "technical_summary",
      "extracted_results",
      "extracted_metrics"
    ].includes(field)
  );
  return {
    data_status: hasCriticalPending ? "incomplete" : "structured",
    missing_fields,
    estimated_fields: [] as string[],
    inferred_fields,
    pending_confirmation_fields,
    technical_questions,
    public_data_disclaimer: pending_confirmation_fields.length || inferred_fields.length
      ? "This report is based on documented field evidence. Some technical details not available in the original report were conservatively estimated by the technical team for guidance purposes and remain subject to confirmation."
      : null,
    internal_notes: inferred_fields.length
      ? "Estimated conservatively from available report context. Pending confirmation by technical field team."
      : null,
    field_status
  };
}

export function generateTechnicalQuestions(fields: readonly string[]) {
  const map: Record<string, string> = {
    crop: "What was the exact crop variety?",
    farm_size: "What was the treatment area or farm size?",
    dosage: "What Nano-Gro dosage was used?",
    application_frequency: "How many applications were made?",
    baseline_yield: "What was the baseline yield?",
    final_yield: "What was the final yield?",
    yield_increase_percent: "Can the yield increase percentage be confirmed from baseline and final yield?",
    roi_value: "Can ROI be calculated from baseline yield, final yield, price, and treatment cost?",
    photos: "Were there before/after photos?",
    videos: "Were there videos documenting the result?",
    lab_reports: "Are there lab reports or technical documents?",
    testimonial: "Is there a documented testimonial and consent to publish?",
    application_method: "What application method was used?",
    problem: "What was the main agronomic problem?",
    treatment_dates: "What were the treatment dates?",
    harvest_dates: "What were the harvest dates?",
    region: "What region or province was the case located in?",
    source_full_text: "Has the complete document text been preserved in source_full_text?",
    technical_summary: "Has a structured technical summary been generated from the full source?",
    executive_narrative: "Has a public executive narrative been generated from the source?",
    extracted_observations: "Were all source observations extracted?",
    extracted_recommendations: "Were all source recommendations extracted?",
    extracted_results: "Were all source results extracted?",
    extracted_metrics: "Were all quantified metrics and percentages extracted?"
  };
  return [...new Set(fields.map((field) => map[field]).filter(Boolean))];
}

export function buildPublicCaseReport(item: CaseStudy, relatedCount: number, messages?: Messages) {
  const assets = item.evidence_assets ?? [];
  const hasMeasuredYield = typeof item.yield_increase_percent === "number";
  const hasRoi = typeof item.roi_value === "number";
  const hasQualitativeResult = Boolean(item.results_summary);
  const disclaimer = item.public_data_disclaimer || (
    (item.pending_confirmation_fields?.length || item.estimated_fields?.length || item.inferred_fields?.length)
      ? messages?.cases.disclaimer ?? "This report is based on documented field evidence. Some technical details not available in the original report were conservatively estimated by the technical team for guidance purposes and remain subject to confirmation."
      : null
  );

  return {
    title: publicContentText(item.title, "Nano-Gro case report"),
    disclaimer,
    metrics: [
      { label: messages?.cases.yield ?? "Yield increase", value: hasMeasuredYield ? `+${item.yield_increase_percent}%` : messages?.caseReport.yieldNotReported ?? "Yield data not reported." },
      { label: messages?.cases.roi ?? "ROI", value: hasRoi ? `${item.roi_value}x` : messages?.caseReport.roiNotCalculated ?? "ROI not calculated due to incomplete baseline data." },
      { label: messages?.cases.complete ?? "Completeness", value: `${item.case_completeness_score ?? 0}/100` },
      { label: "Confidence", value: `${item.confidence_score ?? 0}/100` }
    ],
    sections: [
      {
        title: messages?.caseReport?.summary ?? "Summary",
        body: publicContentText(item.summary, messages?.caseReport.summaryFallback || "Documented Nano-Gro field case prepared for technical review.")
      },
      {
        title: messages?.caseReport?.cropLocation ?? "Crop & Location",
        body: publicContentText([item.crop?.name, item.country?.name, item.region?.name].filter(Boolean).join(" / "), messages?.caseReport.cropLocationFallback || "Crop and location pending confirmation.")
      },
      {
        title: messages?.caseReport?.initialChallenge ?? "Initial Challenge",
        body: publicContentText(item.primary_problem?.name, messages?.caseReport.challengeFallback || "Agronomic challenge pending technical classification.")
      },
      {
        title: messages?.caseReport?.application ?? "Nano-Gro Application",
        body: publicContentText(item.nano_gro_application, messages?.caseReport.applicationFallback || "Application protocol pending technical confirmation."),
        detail: item.dosage ? publicContentText(`${messages?.caseReport.dosage ?? "Dosage"}: ${item.dosage}`) : messages?.caseReport.dosageFallback || "Dosage pending technical confirmation."
      },
      {
        title: messages?.caseReport?.observedResults ?? "Observed Results",
        body: hasQualitativeResult
          ? publicContentText(item.results_summary!)
          : assets.length
            ? messages?.caseReport.visualOnlyResult ?? "Visual improvement documented. Quantified yield data not reported."
            : messages?.caseReport.yieldNotReported ?? "Yield data not reported."
      },
      {
        title: messages?.caseReport?.evidenceAvailable ?? "Evidence Available",
        body: evidenceSummary(item, messages)
      },
      {
        title: messages?.caseReport?.technicalNotes ?? "Technical Notes",
        body: item.pending_confirmation_fields?.length || item.estimated_fields?.length || item.inferred_fields?.length
          ? messages?.caseReport.pendingConfirmation ?? "Technical details remain subject to confirmation."
          : messages?.caseReport.technicalStructured ?? "Technical details are structured for publication."
      },
      {
        title: messages?.caseReport?.similarCases ?? "Similar Cases",
        body: relatedCount ? `${relatedCount} ${messages?.caseReport.relatedAvailable ?? "related documented cases are available below."}` : messages?.caseReport.relatedFallback ?? "Related case matching will improve as more cases are published."
      },
      {
        title: messages?.caseReport?.requestDiagnosis ?? "Request Diagnosis",
        body: messages?.caseReport.requestDiagnosisBody ?? "Submit your crop, hectares, problem, and objective to receive a case-based recommendation."
      }
    ]
  };
}

function evidenceSummary(item: CaseStudy, messages?: Messages) {
  const assets = item.evidence_assets ?? [];
  if (!assets.length) return messages?.caseReport.evidencePending ?? "Evidence files pending attachment.";
  const counts = assets.reduce<Record<string, number>>((acc, asset) => {
    acc[asset.asset_type] = (acc[asset.asset_type] ?? 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts)
    .map(([type, count]) => `${count} ${messages?.caseReport.evidenceTypes?.[type as keyof typeof messages.caseReport.evidenceTypes] ?? publicEvidenceLabel({ asset_type: type as EvidenceAsset["asset_type"] })}`)
    .join(", ");
}
