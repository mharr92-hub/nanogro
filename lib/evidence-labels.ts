import type { EvidenceAsset } from "@/lib/types";

export function publicEvidenceLabel(asset: Pick<EvidenceAsset, "asset_type">, locale: "en" | "es" = "en") {
  const labels = {
    en: {
      photo: "Field photographic record",
      video: "Technical follow-up evidence",
      pdf: "Technical document received",
      document: "Technical document received",
      lab_report: "Technical document received",
      raw_data: "Field record"
    },
    es: {
      photo: "Registro fotografico de campo",
      video: "Evidencia de seguimiento tecnico",
      pdf: "Documento tecnico recibido",
      document: "Documento tecnico recibido",
      lab_report: "Documento tecnico recibido",
      raw_data: "Registro de campo"
    }
  } as const;
  return labels[locale][asset.asset_type];
}

export function publicEvidenceCaption(asset: Pick<EvidenceAsset, "asset_type" | "caption">, locale: "en" | "es" = "en") {
  if (asset.caption && !hasInformalSourceWording(asset.caption)) return asset.caption;
  if (asset.asset_type === "photo") {
    return locale === "es"
      ? "Evidencia fotografica recibida del equipo tecnico."
      : "Photographic evidence received from the technical team.";
  }
  return locale === "es"
    ? "Evidencia recibida para revision y seguimiento tecnico."
    : "Evidence received for technical review and follow-up.";
}

export function hasInformalSourceWording(value: string) {
  return /\b(whatsapp|wa|chat|screenshot|phone chat|message app)\b/i.test(value);
}

export function publicContentText(value: string | null | undefined, fallback = "") {
  if (!value) return fallback;
  return value
    .replace(/\bWhatsApp\b/gi, "field team")
    .replace(/\bWA\b/g, "field team")
    .replace(/\bchat\b/gi, "field follow-up")
    .replace(/\bscreenshot\b/gi, "field photographic record")
    .replace(/\bphone message\b/gi, "field follow-up record")
    .replace(/\bmessage app\b/gi, "field follow-up record")
    .replace(/\bsource file\b/gi, "technical document")
    .replace(/\bsource document\b/gi, "technical document")
    .replace(/\blinked source document\b/gi, "technical report")
    .replace(/\bsource folder\b/gi, "evidence record")
    .replace(/\bsource evidence\b/gi, "technical field evidence")
    .replace(/\bsource report\b/gi, "technical field report")
    .replace(/\breal source\b/gi, "technical record")
    .replace(/\braw data\b/gi, "field record")
    .replace(/\bPDF requires conversion before\b/gi, "Technical document requires field-team review before")
    .replace(/\bLegacy \.doc requires conversion before\b/gi, "Technical document requires field-team review before")
    .replace(/\brequires conversion before\b/gi, "requires field-team review before")
    .replace(/\brequires text extraction before\b/gi, "requires technical review before")
    .replace(/\brequire OCR\/manual review before\b/gi, "require technical review before")
    .replace(/\bextraction\/OCR pending\b/gi, "technical review pending")
    .replace(/\bOCR\b/g, "technical review")
    .replace(/\bnull\b/gi, "")
    .replace(/\bundefined\b/gi, "")
    .replace(/\bN\/A\b/gi, "")
    .replace(/\bfake\b/gi, "")
    .replace(/\bfictitious\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}
