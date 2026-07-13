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

/** Nivel de evidencia tal y como esta guardado en la base. */
export function evidenceLevelOf(item: CaseStudy): EvidenceLevel {
  return isEvidenceLevel(item.evidence_level) ? item.evidence_level : "D";
}

const LEVEL_ORDER: EvidenceLevel[] = ["A", "B", "C", "D"];

/**
 * El nivel que la evidencia REALMENTE sostiene, segun las definiciones de la spec:
 *
 *   A  datos productivos completos + fotos antes/despues + validacion tecnica
 *   B  datos productivos parciales + evidencia visual
 *   C  testimonio o documento tecnico de soporte
 *   D  el resto
 */
export function supportedEvidenceLevel(item: CaseStudy): EvidenceLevel {
  const checklist = getEvidenceChecklist(item);
  const has = (key: EvidenceChecklistKey) => checklist.find((entry) => entry.key === key)?.met ?? false;

  const productiveData = has("productiveData");
  const visual = has("fieldPhotos") || has("video");

  if (productiveData && has("beforeAfterPhotos") && has("technicalValidation")) return "A";
  if (productiveData && visual) return "B";
  if (has("testimonial") || has("technicalDocument")) return "C";
  return "D";
}

/**
 * El nivel que se PUBLICA: el peor entre el declarado y el que la evidencia sostiene.
 *
 * Habia casos marcados como Nivel A cuyo propio checklist decia "Fotografias de antes y
 * despues: no documentado". Las dos cosas no pueden ser ciertas, y en un sistema de
 * evidencia el que gana es el checklist, porque se deriva de los archivos que existen de
 * verdad. Nunca se muestra al visitante un nivel mejor del que los datos aguantan; si el
 * equipo quiere el nivel A, tiene que subir las fotos, no cambiar la etiqueta.
 */
export function publicEvidenceLevel(item: CaseStudy): EvidenceLevel {
  const declared = evidenceLevelOf(item);
  const supported = supportedEvidenceLevel(item);
  return LEVEL_ORDER.indexOf(declared) >= LEVEL_ORDER.indexOf(supported) ? declared : supported;
}
