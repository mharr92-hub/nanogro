import type { EvidenceAsset } from "@/lib/types";

/**
 * ¿Es una fotografia de campo, o un documento escaneado?
 *
 * Los dos llegan como `asset_type: "photo"` porque los dos son JPEG. La diferencia esta en
 * la etapa: una foto de campo pertenece al antes, el durante o el despues del cultivo; un
 * informe escaneado entra como "final" o "supporting".
 *
 * Sin esta distincion, las siete paginas escaneadas del informe de Cuba se colaban en la
 * galeria de "Antes y despues" y en las previsualizaciones de la home: siete fotos de un
 * papel donde deberia haber siete fotos de un campo.
 */
const FIELD_STAGES = new Set(["before", "during", "after"]);

export function isFieldPhoto(asset: EvidenceAsset) {
  return asset.asset_type === "photo" && FIELD_STAGES.has(asset.evidence_stage ?? "");
}
