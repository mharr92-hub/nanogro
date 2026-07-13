import Image from "next/image";
import type { EvidenceAsset } from "@/lib/types";
import { publicEvidenceLabel } from "@/lib/evidence-labels";
import type { Locale } from "@/lib/i18n-shared";

/**
 * Toda imagen publica pasa por aqui.
 *
 * Regla del MVP de 48h: "Every public image needs alt text". El admin ya captura
 * `alt_text` desde la migracion 001, pero la app nunca lo renderizaba: usaba la etiqueta
 * generica de categoria. Aqui se usa el alt_text real y solo se cae a la etiqueta cuando
 * de verdad no hay ninguno.
 *
 * `sizes` esta declarado para que next/image sirva la variante correcta a un telefono de
 * gama media, que es de donde llega la mayoria del trafico.
 */
export function EvidenceImage({
  asset,
  locale,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  className = "",
  priority = false
}: {
  asset: EvidenceAsset;
  locale: Locale;
  sizes?: string;
  className?: string;
  priority?: boolean;
}) {
  const alt = asset.alt_text?.trim() || publicEvidenceLabel(asset, locale);
  return (
    <Image
      alt={alt}
      className={className}
      src={asset.file_url}
      fill
      sizes={sizes}
      priority={priority}
      loading={priority ? undefined : "lazy"}
    />
  );
}
