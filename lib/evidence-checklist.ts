import type { CaseStudy, EvidenceLevel } from "@/lib/types";
import { hasApprovedTestimonial } from "@/lib/publication-quality";

/**
 * El checklist que hace explicable el score de confianza.
 *
 * La spec (seccion 6) es explicita: "The public case page should display the final
 * score and the evidence checklist so users understand why a case is strong or
 * incomplete." Un "72/100" sin checklist no es informacion, es decoracion.
 *
 * Solo reporta lo que el esquema puede probar. La spec contempla `has_control_group`,
 * pero la base de datos no tiene esa columna todavia: se omite en lugar de inventarla.
 */

export const evidenceChecklistKeys = [
  "productiveData",
  "roiDocumented",
  "beforeAfterPhotos",
  "fieldPhotos",
  "video",
  "technicalDocument",
  "testimonial",
  "technicalValidation"
] as const;

export type EvidenceChecklistKey = (typeof evidenceChecklistKeys)[number];

export type EvidenceChecklistItem = {
  key: EvidenceChecklistKey;
  met: boolean;
};

const technicalValidationStatuses = new Set(["agronomist_review", "lab_supported", "third_party"]);
const documentTypes = new Set(["pdf", "document", "lab_report"]);

export function getEvidenceChecklist(item: CaseStudy): EvidenceChecklistItem[] {
  const assets = item.evidence_assets ?? [];
  const photos = assets.filter((asset) => asset.asset_type === "photo");

  const met: Record<EvidenceChecklistKey, boolean> = {
    productiveData:
      typeof item.yield_increase_percent === "number" ||
      typeof item.quality_improvement_percent === "number" ||
      typeof item.disease_reduction_percent === "number",
    roiDocumented: typeof item.roi_value === "number",
    beforeAfterPhotos:
      photos.some((asset) => asset.evidence_stage === "before") && photos.some((asset) => asset.evidence_stage === "after"),
    fieldPhotos: photos.length > 0,
    video: assets.some((asset) => asset.asset_type === "video"),
    technicalDocument: assets.some((asset) => documentTypes.has(asset.asset_type)),
    testimonial: hasApprovedTestimonial(item),
    technicalValidation: technicalValidationStatuses.has(item.verification_status ?? "")
  };

  return evidenceChecklistKeys.map((key) => ({ key, met: met[key] }));
}

/** Cuenta de items documentados, para el resumen "5 de 8 documentados". */
export function countDocumented(checklist: EvidenceChecklistItem[]) {
  return checklist.filter((entry) => entry.met).length;
}

export function isEvidenceLevel(value: string | null | undefined): value is EvidenceLevel {
  return value === "A" || value === "B" || value === "C" || value === "D";
}

/** Nivel de evidencia normalizado: nunca inventa un nivel mejor del que hay. */
export function evidenceLevelOf(item: CaseStudy): EvidenceLevel {
  return isEvidenceLevel(item.evidence_level) ? item.evidence_level : "D";
}
