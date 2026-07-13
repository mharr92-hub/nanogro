import Link from "next/link";
import type { CSSProperties } from "react";
import { getCaseFigures } from "@/lib/case-metrics";
import { publicEvidenceLevel } from "@/lib/evidence-checklist";
import { publicContentText } from "@/lib/evidence-labels";
import { countryIcon, cropIcon, problemIcon } from "@/lib/icons";
import { Emoji } from "./Emoji";
import { localizedHref, type Locale, type Messages } from "@/lib/i18n-shared";
import type { CaseStudy, EvidenceLevel } from "@/lib/types";
import { EvidenceLevelBadge } from "./Badge";

/**
 * LA FICHA DE EVIDENCIA — el elemento firma de la plataforma.
 *
 * Un panel con estetica de ficha de laboratorio: esquinas rectas, retícula tenue,
 * franja superior con el color del nivel de evidencia, identificador del caso en
 * cifra monoespaciada. Responde de un vistazo a las siete preguntas que un
 * agricultor se hace antes de confiar en un resultado:
 *
 *   Cultivo · Pais · Problema · Resultado · ROI · Nivel de evidencia · Confianza
 *
 * Es el mismo objeto en toda la plataforma: en la tarjeta de un listado (compact),
 * en la cabecera del detalle de caso (full), en el resultado del diagnostico y en
 * el comparador. Que el agricultor reconozca la ficha es lo que convierte una web
 * en un sistema de evidencia.
 */

const accentVar: Record<EvidenceLevel, string> = {
  A: "var(--level-a)",
  B: "var(--level-b)",
  C: "var(--level-c)",
  D: "var(--level-d)"
};

export function EvidenceSheet({
  item,
  messages,
  locale,
  variant = "compact",
  reasons,
  headingLevel = "h3"
}: {
  item: CaseStudy;
  messages: Messages;
  locale: Locale;
  variant?: "compact" | "full";
  reasons?: string[];
  headingLevel?: "h2" | "h3";
}) {
  // El nivel publicado nunca supera al que la evidencia sostiene. Ver lib/evidence-checklist.ts.
  const level = publicEvidenceLevel(item);
  const href = localizedHref(locale, `/cases/${item.slug}`);
  const title = publicContentText(item.title, messages.sheet.untitledCase);
  const Heading = headingLevel;
  // El resultado no siempre es un % de rendimiento: puede ser dias de adelanto o vigor.
  // Lista ordenada y SIN repeticiones: la ficha toma la primera y la segunda.
  const figures = getCaseFigures(item, messages);

  return (
    <article
      /*
       * `h-full` SOLO en la variante compacta: ahi la ficha es una tarjeta dentro de una
       * grilla y debe igualar la altura de sus hermanas. En la variante `full` del detalle
       * de caso, `h-full` la estiraba hasta la altura del panel lateral y dejaba un enorme
       * bloque vacio con la reticula a la vista.
       */
      className={["sheet flex flex-col p-5", variant === "compact" ? "h-full" : ""].filter(Boolean).join(" ")}
      style={{ "--sheet-accent": accentVar[level] } as CSSProperties}
    >
      <header className="flex flex-wrap items-center justify-between gap-2">
        <p className="tabular text-caption uppercase text-muted-foreground">
          {messages.sheet.eyebrow}
          {item.public_id ? <span className="ml-2 text-foreground">{item.public_id}</span> : null}
        </p>
        <EvidenceLevelBadge level={level} messages={messages} showName={variant === "full"} />
      </header>

      <Heading className={variant === "full" ? "mt-3 text-h1 text-foreground" : "mt-3 text-h4 text-foreground"}>
        {variant === "full" ? title : <Link href={href}>{title}</Link>}
      </Heading>

      <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-4 text-body">
        <Field
          label={messages.common.crop}
          value={item.crop?.name}
          icon={item.crop ? cropIcon(item.crop) : undefined}
          fallback={messages.sheet.notReported}
        />
        <Field
          label={messages.common.country}
          value={item.country?.name}
          icon={item.country ? countryIcon(item.country) : undefined}
          fallback={messages.sheet.notReported}
        />
        <Field
          label={messages.common.problem}
          value={item.primary_problem?.name}
          icon={item.primary_problem ? problemIcon(item.primary_problem) : undefined}
          fallback={messages.sheet.notReported}
        />
      </dl>

      <dl className="sheet-rule mt-4 grid grid-cols-3 gap-3 pt-4">
        <Figure
          label={figures[0]?.label ?? messages.sheet.result}
          value={figures[0]?.value ?? null}
          fallback={messages.sheet.notReported}
          tone="text-primary"
        />
        <Figure
          label={figures[1]?.label ?? messages.sheet.roi}
          value={figures[1]?.value ?? null}
          fallback={messages.sheet.notReported}
          tone="text-data"
        />
        <Figure
          label={messages.sheet.confidence}
          value={typeof item.confidence_score === "number" ? `${item.confidence_score}/100` : null}
          fallback={messages.sheet.notReported}
          tone="text-data"
        />
      </dl>

      {reasons && reasons.length > 0 ? (
        <p className="mt-4 text-caption text-muted-foreground">
          <span className="font-semibold text-foreground">{messages.cases.matchedBy}:</span> {reasons.join(" · ")}
        </p>
      ) : null}

      {variant === "compact" ? (
        <Link
          className="btn btn-secondary mt-5 w-full"
          href={href}
          aria-label={`${messages.cases.viewCase}: ${title}`}
        >
          {messages.cases.viewCase}
        </Link>
      ) : null}
    </article>
  );
}

function Field({
  label,
  value,
  icon,
  fallback
}: {
  label: string;
  value?: string | null;
  icon?: string;
  fallback: string;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-caption uppercase tracking-wide text-muted-foreground">{label}</dt>
      {/* Nada de `truncate`: un "El Salva..." no informa de nada. El texto se ajusta en
          varias lineas con cuerpo pequeno y se lee entero. */}
      <dd className="mt-1 flex items-start gap-1.5">
        {value && icon ? <Emoji symbol={icon} className="mt-0.5" /> : null}
        <span
          className={[
            "hyphens-auto break-words text-caption leading-snug",
            value ? "font-semibold text-foreground" : "text-muted-foreground"
          ].join(" ")}
        >
          {value || fallback}
        </span>
      </dd>
    </div>
  );
}

function Figure({
  label,
  value,
  fallback,
  tone
}: {
  label: string;
  value: string | null;
  fallback: string;
  tone: string;
}) {
  /*
   * El tamano de la cifra se adapta a lo larga que sea.
   *
   * "234.69 qq/mz" no cabe en el mismo cuerpo que "+30%", y recortarlo a "234.6..." destruye
   * el dato: un numero a medias no es un numero. Asi que las cifras largas bajan de cuerpo y
   * se ajustan en dos lineas, pero se leen ENTERAS. Nunca se corta un dato.
   */
  const length = (value ?? "").length;
  const size = length <= 7 ? "text-metric" : length <= 12 ? "text-h3" : "text-h5";

  return (
    <div className="min-w-0">
      <dt className="text-caption uppercase leading-tight tracking-wide text-muted-foreground">{label}</dt>
      <dd
        className={[
          "tabular mt-1 break-words leading-tight",
          value ? `${size} ${tone}` : "text-caption text-muted-foreground"
        ].join(" ")}
      >
        {value ?? fallback}
      </dd>
    </div>
  );
}

